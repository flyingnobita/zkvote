import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { generateProof } from "@semaphore-protocol/proof";
import { useQRCode } from "next-qrcode";

import {
  Body,
  Button,
  Container,
  BodyText,
  // Image,
  DivFlex,
  // DivPassword,
  // LabelPassword,
  // InputPassword,
  // DivStatus,
  Title,
  Title2,
  // BottomText,
  // PriceText,
  // Link,
  // LinkLogoContainer,
  // LinkLogo,
  // DivScrollable,
  // DivTooltip,
  // DivTooltipText,
  // Pre,
  // Details,
  // Summary,
  // ZkDetails,
  // DivLeftAlign,
  // DetailButton,
  // DivFlexInputContainer,
  // DivFlexInput,
  // DivFlexFormContainer,
  // DivFlexForm,
  // ZKDetailStatus,
  // Textarea,
  // ToggleWrapper,
  // ToggleLabel,
  // Toggle,
  // ToggleLabelExternal,
  // ToggleContainer,
} from "./components";

import SemaphoreVotingAbiJson from "@nft-zk/contracts/frontend/SemaphoreVoting.json";
import * as SemaphoreVotingAddressJson from "@nft-zk/contracts/frontend/SemaphoreVoting_address.json";

import WalletConnectProvider from "@walletconnect/web3-provider";

import { proofRequest } from "./Qr";

const pollId = 1;
const merkleTreeDepth = 20;

const providerWalletConnect = new WalletConnectProvider({
  rpc: {
    // 80001: "https://rpc-mumbai.maticvigil.com/",
    1337: "http://localhost:8545/",
  },
});

const wasmFilePath = "semaphore.wasm";
const zkeyFilePath = "semaphore.zkey";

const SemaphoreVotingAddress = SemaphoreVotingAddressJson.Contract;

function App() {
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);
  const [voteCount0, setVoteCount0] = useState(0);
  const [voteCount1, setVoteCount1] = useState(0);
  const [semaphoreVoting, setSemaphoreVoting] = useState(null);
  const [signer, setSigner] = useState(null);
  const [signerAddress, setSignerAddress] = useState(null);

  const { Canvas } = useQRCode();

  // useEffect(() => {
  //   try {
  //     // const ret = new ethers.providers.Web3Provider(window.ethereum);  // Metamask
  //     const ret = new ethers.providers.Web3Provider(providerWalletConnect);
  //     setProvider(ret);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  useEffect(() => {
    if (provider) {
      console.log(provider);
      // console.log(await provider.getAddress());

      const signer = provider.getSigner();
      (async () => {
        const address = await signer.getAddress();
        console.log("Signer Address: ", address);
      })();
    }
  });

  const showStatus = (inputStatus) => {
    setStatus(inputStatus);
  };

  async function connectWallet() {
    (async () => {
      await providerWalletConnect.enable();
    })();

    try {
      // const ret = new ethers.providers.Web3Provider(window.ethereum);  // Metamask
      const ret = new ethers.providers.Web3Provider(providerWalletConnect);
      setProvider(ret);
    } catch (error) {
      console.log(error);
    }

    if (!provider) {
      showStatus("Metamask not found. Pleaes connect Metamask");
      return;
    }
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress_ = await signer.getAddress();
    console.log("signerAddress_: ", signerAddress_);
    setSigner(signer);
    setSignerAddress(signerAddress_);
  }

  async function castVote(vote) {
    showStatus("");

    const SemaphoreVotingContract = new ethers.Contract(
      SemaphoreVotingAddress,
      SemaphoreVotingAbiJson,
      signer
    );
    console.log("SemaphoreVotingContract: ", SemaphoreVotingContract);
    setSemaphoreVoting(SemaphoreVotingContract);

    const group = new Group(pollId, merkleTreeDepth);

    const identity = new Identity("test");
    group.addMember(identity.commitment);

    console.log("addMember Done");

    let fullProof;
    try {
      fullProof = await generateProof(identity, group, pollId, vote, {
        wasmFilePath,
        zkeyFilePath,
      });
    } catch (err) {
      console.log("generateProof err:", err);
    }
    console.log("fullProof: ", fullProof);

    const castVoteResponse = await SemaphoreVotingContract.castVote(
      vote,
      fullProof.nullifierHash,
      pollId,
      fullProof.proof,
      { gasLimit: 5000000 }
    );

    console.log("response: ", castVoteResponse);

    viewVote();
  }

  async function viewVote() {
    const signer = provider.getSigner();
    const signerAddress_ = await signer.getAddress();
    console.log("signerAddress_: ", signerAddress_);

    const SemaphoreVotingContract = new ethers.Contract(
      SemaphoreVotingAddress,
      SemaphoreVotingAbiJson,
      signer
    );

    const voteCount0 = await SemaphoreVotingContract.getVoteCount(1, 0);
    const voteCount1 = await SemaphoreVotingContract.getVoteCount(1, 1);
    setVoteCount0(ethers.utils.formatEther(voteCount0) * 10 ** 18);
    setVoteCount1(ethers.utils.formatEther(voteCount1) * 10 ** 18);

    console.log("voteCount0: ", ethers.utils.formatEther(voteCount0));
    console.log("voteCount1: ", ethers.utils.formatEther(voteCount1));
  }

  async function handleButtonVoteYes(e) {
    e.preventDefault();
    await castVote(1);
  }

  async function handleButtonVoteNo(e) {
    e.preventDefault();
    await castVote(0);
  }

  async function handleButtonViewVote(e) {
    e.preventDefault();
    await viewVote();
  }

  return (
    <div className="App">
      <Container>
        <Body>
          <Title>zkVoting with Semaphore on Polygon ID</Title>
          <DivFlex>
            <Button onClick={connectWallet}>Connect</Button>
          </DivFlex>
          signerAddress: {signerAddress}
          <Canvas
            text={JSON.stringify(proofRequest)}
            options={{
              level: "M",
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: "#010599FF",
                light: "#FFBF60FF",
              },
            }}
          />
          <Title2>Is Polygon gonna moon?</Title2>
          <DivFlex>
            <Button onClick={handleButtonVoteYes}>Yes</Button>
          </DivFlex>
          <DivFlex>
            <Button onClick={handleButtonVoteNo}>No</Button>
          </DivFlex>
          <DivFlex>
            <Button onClick={handleButtonViewVote}>View Vote</Button>
          </DivFlex>
          <h2>Poll:</h2>
          <BodyText>Yes: {voteCount0}</BodyText>
          <BodyText>No: {voteCount1}</BodyText>
        </Body>
      </Container>
    </div>
  );
}

export default App;
