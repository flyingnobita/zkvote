import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

import {
  Body,
  Button,
  Container,
  // Image,
  DivFlex,
  // DivPassword,
  // LabelPassword,
  // InputPassword,
  // DivStatus,
  Title,
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

import WalletConnectProvider from "@walletconnect/web3-provider";

import SemaphoreVotingAbiJson from "@nft-zk/contracts/frontend/SemaphoreVoting.json";
import * as SemaphoreVotingAddressJson from "@nft-zk/contracts/frontend/SemaphoreVoting_address.json";

const providerWalletConnect = new WalletConnectProvider({
  rpc: {
    // 80001: "https://rpc-mumbai.maticvigil.com/",
    1337: "http://localhost:8545/",
  },
});

(async () => {
  await providerWalletConnect.enable();
})();

const SemaphoreVotingAddress = SemaphoreVotingAddressJson.Contract;

function App() {
  const [status, setStatus] = useState("");
  const [provider, setProvider] = useState(null);

  // useEffect(() => {
  //   try {
  //     // const ret = new ethers.providers.Web3Provider(window.ethereum);  // Metamask
  //     const ret = new ethers.providers.Web3Provider(providerWalletConnect);
  //     setProvider(ret);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   loadVerificationKey();
  // }, [loadVerificationKey]);

  useEffect(() => {
    if (provider) {
      console.log(provider);
      // console.log(await provider.getAddress());

      const signer = provider.getSigner();
      (async () => {
        const address = await signer.getAddress();
        console.log(address);
      })();
    }
  });

  const showStatus = (inputStatus) => {
    setStatus(inputStatus);
  };

  async function vote() {
    showStatus("");

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
    console.log("a");
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const signerAddress_ = await signer.getAddress();
    console.log("signerAddress_: ", signerAddress_);
  }

  async function handleButtonVote(e) {
    e.preventDefault();
    await vote();
  }

  return (
    <div className="App">
      <Container>
        <Body>
          <Title>zkVoting with Semaphore on Polygon ID</Title>
          <DivFlex>
            <Button onClick={handleButtonVote}>Vote</Button>
          </DivFlex>
        </Body>
      </Container>
    </div>
  );
}

export default App;
