// import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy"
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import 'dotenv/config'
import "@semaphore-protocol/hardhat"
// import "./tasks/deploy-semaphore-voting"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `${process.env.RPC_MUMBAI_URL}`,
      },
      accounts: {
        mnemonic: process.env.MNEMONIC,
        count: 10,
      },
      chainId: 1337
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;