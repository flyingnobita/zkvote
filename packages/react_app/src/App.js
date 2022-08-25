import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

import {
  Body,
  Button,
  Container,
  Image,
  DivFlex,
  DivPassword,
  LabelPassword,
  InputPassword,
  DivStatus,
  Title,
  BottomText,
  PriceText,
  Link,
  LinkLogoContainer,
  LinkLogo,
  DivScrollable,
  DivTooltip,
  DivTooltipText,
  Pre,
  Details,
  Summary,
  ZkDetails,
  DivLeftAlign,
  DetailButton,
  DivFlexInputContainer,
  DivFlexInput,
  DivFlexFormContainer,
  DivFlexForm,
  ZKDetailStatus,
  Textarea,
  ToggleWrapper,
  ToggleLabel,
  Toggle,
  ToggleLabelExternal,
  ToggleContainer,
} from "./components";

import { prove, verify, genSolCallData } from "./components/zk";

import logo from "./assets/images/87.png";
import githubLogo from "./assets/images/GitHub-Mark-120px-plus.png";
import openseaLogo from "./assets/images/Logomark-Blue.png";

import MintZKNftAbiJson from "@nft-zk/contracts/frontend/MintZKNft.json";
import * as MintZKNftAddressJson from "@nft-zk/contracts/frontend/MintZKNft_address.json";

const MintZKNftAddress = MintZKNftAddressJson.Contract;
const vkeyJsonFilePlonk = "CheckPassword_verification_key_plonk.json";
const vkeyJsonFileGroth16 = "CheckPassword_verification_key_groth16.json";

const hashedPassword1 =
  "2659885370391636708883459370353623141128982085472165018711164208023811132296";
const hashedPassword2 =
  "4420175747054003989426052527768028062432413895992728912331985761657509285976";
const hashedPassword3 =
  "16033069969059630745700456097076759987953764636749827514225296156239583210211";

function App() {
  const [status, setStatus] = useState("");
  const [zkStatus, setZkStatus] = useState("");
  const [input, setInput] = useState({
    a: hashedPassword1,
    b: hashedPassword2,
    c: hashedPassword3,
    d: "",
  });
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState();
  const [vkeyJson, setvkeyJson] = useState();
  const [solCallData, setSolCallData] = useState();
  const [password, setPassword] = useState("");
  const [isGroth16, setGroth16] = useState(false);
  const [provider, setProvider] = useState(null);

  const loadVerificationKey = useCallback(async () => {
    await fetch(isGroth16 ? vkeyJsonFileGroth16 : vkeyJsonFilePlonk)
      .then((response) => response.json())
      .then((data) => {
        setvkeyJson(data);
      });
  }, [isGroth16]);

  useEffect(() => {
    try {
      const ret = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ret);
    } catch (error) {
      console.log("Metamask not found");
    }
  }, []);

  useEffect(() => {
    loadVerificationKey();
  }, [loadVerificationKey]);

  const showStatus = (inputStatus) => {
    setStatus(inputStatus);
  };
  const showZkStatus = (inputStatus) => {
    setZkStatus(inputStatus);
  };

  async function mint() {
    showStatus("");

    if (!provider) {
      showStatus("Metamask not found. Pleaes connect Metamask");
      return;
    }

    let solCallData, proof, publicSignals;
    try {
      showStatus("Generating proof...");
      ({ proof, publicSignals } = await prove(input, isGroth16));
      setProof(proof);
      setPublicSignals(publicSignals);

      showStatus("");
    } catch (err) {
      showStatus("Password incorrect");
      // console.log(err);
      return;
    }
    try {
      showStatus("Generating solidity call data...");
      if (!publicSignals || !proof) {
        showStatus("Public Signals or Proof missing");
        return;
      }
      const result = await genSolCallData(proof, publicSignals, isGroth16);
      if (result[0]) {
        solCallData = result[1];
        setSolCallData(solCallData);
        showStatus("Solidity call data generated!");
      } else {
        showStatus(result[1]);
      }
    } catch (err) {
      showStatus("Password incorrect");
      // console.log(err);
    }

    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress_ = await signer.getAddress();
    // console.log("solCallData: ", solCallData);
    // console.log(typeof solCallData);
    // console.log("signerAddress_: ", signerAddress_);

    if (
      solCallData &&
      signerAddress_ &&
      typeof window.ethereum !== "undefined"
    ) {
      showStatus("Minting");
      try {
        const MintZKNftContract = new ethers.Contract(
          MintZKNftAddress,
          MintZKNftAbiJson,
          signer
        );
        // console.log("MintZKNftContract: ", MintZKNftContract);

        // let contractCode = await provider.getCode(MintZKNftAddress);
        // console.log("contractCode: ", contractCode);

        let tx;

        if (!isGroth16) {
          const solCallDataArray = solCallData.split(",");
          let splits = [solCallDataArray.shift(), solCallDataArray.join(",")];
          let proofSolCallData = splits[0];
          let publicSignalsSolCallData = JSON.parse(splits[1]);

          // console.log("proofSolCallData: ", proofSolCallData);
          // console.log("publicSignalsSolCallData: ", publicSignalsSolCallData);

          tx = await MintZKNftContract.mintPlonk(
            proofSolCallData,
            publicSignalsSolCallData,
            { gasLimit: 1000000 }
          );
        } else {
          let groth16SolCallData = JSON.parse("[" + solCallData + "]");

          tx = await MintZKNftContract.mintGroth16(
            groth16SolCallData[0],
            groth16SolCallData[1],
            groth16SolCallData[2],
            groth16SolCallData[3],
            { gasLimit: 1000000 }
          );
        }
        let tx_receipt = await tx.wait();
        if (tx_receipt.status === 1) {
          showStatus("Minting success!");
        }
      } catch (err) {
        // console.log("err: ", err);
        // console.log("err.name: ", err.name);
        // console.log("err.code: ", err.code);
        // console.log("err.message: ", err.message);
        // console.log("err.data: ", err.data);
        // console.log("typeof(err.message): ", typeof err.message);

        if (!err.message) {
          if (
            err.data.message.includes(
              "Error: VM Exception while processing transaction"
            )
          ) {
            try {
              // await method.estimateGas(transaction);
              showStatus("Unknown error. Please try again.");
            } catch (err2) {
              if (err2.message.includes("Kanji:")) {
                showStatus(err2.message);
              }
            }
          } else {
            showStatus(err);
          }
        } else if (err.message.includes("Kanji: ")) {
          const innerErrorMsg = err.message.split("\n")[3];
          var contractError = innerErrorMsg.split("Kanji: ").pop();
          contractError = contractError.substring(0, contractError.length - 2);

          showStatus(contractError);
        } else if (err.message.includes("user rejected transaction")) {
          showStatus("You cancelled the transaction");
        } else if (err.message.includes("execution reverted: ")) {
          showStatus(
            err.message
              .split("execution reverted: ")[1]
              .replace(/"/g, "\n")
              .split("\n")[0]
          );
        } else if (err.message.includes("insufficient funds")) {
          showStatus("Insufficient funds");
        } else if (err.message.includes("[object Object]")) {
        } else {
          showStatus(err.message);
        }
      }
    }
  }

  const handleAInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      a: event.target.value,
    }));
  };

  const handleBInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      b: event.target.value,
    }));
  };

  const handleCInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      c: event.target.value,
    }));
  };

  const handleDInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      d: event.target.value,
    }));
  };

  const handlePublicSignalChanged = (event) => {
    let val = [event.target.value];
    val = val[0].split(",");
    setPublicSignals(val);
  };

  async function handleButtonProve(e) {
    e.preventDefault();
    showZkStatus("Generating proof...");
    try {
      const { proof, publicSignals } = await prove(input, isGroth16);
      setProof(proof);
      setPublicSignals(publicSignals);

      showZkStatus("Proof success");
    } catch (err) {
      // console.log(err);
      showZkStatus("Password incorrect");
    }
  }

  async function handleButtonVerify(e) {
    e.preventDefault();
    showZkStatus("Verifying proof...");
    const res = await verify(vkeyJson, publicSignals, proof, isGroth16);
    showZkStatus(res);
  }

  async function handleButtonGenSolCallData(e) {
    e.preventDefault();
    showZkStatus("Generating solidity verification [arameters...");
    if (!publicSignals || !proof) {
      showZkStatus("Public Signals or Proof missing");
      return;
    }
    const result = await genSolCallData(proof, publicSignals, isGroth16);
    if (result[0]) {
      setSolCallData(result[1]);
    } else {
      showZkStatus(result[1]);
      return;
    }
    showZkStatus("Solidity verification parameters generated!");
  }

  async function handleButtonMint(e) {
    e.preventDefault();
    await mint();
  }

  const onNewsletterChange = (checked) => {
    setGroth16(checked);
  };

  return (
    <div className="App">
      <Container>
        <Body>
          <Title>Mint AI Generated Kanji NFTs with Zero Knowledge Proofs</Title>
          <ToggleContainer>
            <ToggleLabelExternal>Plonk</ToggleLabelExternal>
            <ToggleWrapper>
              <Toggle
                id="checkbox"
                type="checkbox"
                checked={isGroth16}
                onChange={(e) => onNewsletterChange(e.target.checked)}
              />
              <ToggleLabel htmlFor="checkbox" />
            </ToggleWrapper>
            <ToggleLabelExternal>Groth16</ToggleLabelExternal>
          </ToggleContainer>
          <Image src={logo} alt="kanji" />
          <PriceText>Price - FREE</PriceText>
          <DivPassword>
            <LabelPassword>PASSWORD</LabelPassword>
            <DivTooltip>
              (Hint)
              <DivTooltipText>Try one of: 11111, 22222, 33333</DivTooltipText>
            </DivTooltip>
            <InputPassword
              value={password}
              onInput={(e) => {
                setPassword(e.target.value);
                setInput((prevState) => ({
                  ...prevState,
                  d: e.target.value,
                }));
              }}
            />
          </DivPassword>
          <DivFlex>
            <Button onClick={handleButtonMint}>Mint (Rinkeby)</Button>
          </DivFlex>
          <DivStatus>{status}</DivStatus>
          <DivFlex>
            <p>
              <Link href="https://flyingnobita.com/posts/2022/09/09/mint-nft-zk">
                blog post
              </Link>
            </p>
          </DivFlex>
          <DivLeftAlign>
            <Details>
              <Summary>ZK Details</Summary>
              <ZkDetails>
                <h2>Prover</h2>
                <DivFlexFormContainer>
                  <DivFlexForm onSubmit={handleButtonProve}>
                    <DivFlexInputContainer>
                      <label>Password Hash 1:</label>
                      <DivFlexInput
                        type="text"
                        value={input.a}
                        onChange={handleAInputChange}
                      />
                    </DivFlexInputContainer>
                    <DivFlexInputContainer>
                      <label>Password Hash 2:</label>
                      <DivFlexInput
                        type="text"
                        value={input.b}
                        onChange={handleBInputChange}
                      />
                    </DivFlexInputContainer>
                    <DivFlexInputContainer>
                      <label>Password Hash 3:</label>
                      <DivFlexInput
                        type="text"
                        value={input.c}
                        onChange={handleCInputChange}
                      />
                    </DivFlexInputContainer>
                    <DivFlexInputContainer>
                      <label>Minter Password:</label>
                      <DivFlexInput
                        type="text"
                        value={input.d}
                        onChange={handleDInputChange}
                      />
                    </DivFlexInputContainer>
                    <DetailButton type="submit" value="Prove">
                      Prove
                    </DetailButton>
                  </DivFlexForm>
                  <ZKDetailStatus>{zkStatus}</ZKDetailStatus>
                </DivFlexFormContainer>
                <h2>Verifier</h2>
                <h3>Public Signals</h3>
                <Textarea
                  defaultValue={publicSignals}
                  onChange={handlePublicSignalChanged}
                  rows="5"
                />
                <h3>Proof</h3>
                {proof != null && (
                  <DivScrollable>
                    <Pre>{JSON.stringify(proof, null, 2)}</Pre>
                  </DivScrollable>
                )}
                <h3>Verification Key</h3>
                <DivScrollable>
                  <Pre>{JSON.stringify(vkeyJson, null, 2)}</Pre>
                </DivScrollable>
                <DetailButton onClick={handleButtonVerify}>Verify</DetailButton>
                <ZKDetailStatus>{zkStatus}</ZKDetailStatus>
                <h3>Solidity Verification Parameters</h3>
                {solCallData != null && (
                  <DivScrollable>
                    <Pre>{JSON.stringify(solCallData, null, 2)}</Pre>
                  </DivScrollable>
                )}
                <DetailButton onClick={handleButtonGenSolCallData}>
                  Generate
                </DetailButton>
                <ZKDetailStatus>{zkStatus}</ZKDetailStatus>
              </ZkDetails>
            </Details>
          </DivLeftAlign>
          <BottomText>
            <p>
              Kanji generated from{" "}
              <Link href="https://github.com/hardmaru/sketch-rnn">
                sketch-rnn
              </Link>
            </p>
          </BottomText>
          <LinkLogoContainer>
            <Link href="https://github.com/flyingnobita/nft-zk">
              <LinkLogo src={githubLogo} alt="github" />
            </Link>
            <Link href="https://testnets.opensea.io/collection/kanji-v3">
              <LinkLogo src={openseaLogo} alt="opensea" />
            </Link>
          </LinkLogoContainer>
        </Body>
      </Container>
    </div>
  );
}

export default App;
