import { ethers } from "hardhat";
import DeployHelper from "./deploy_helper";

const contractName1: string = "PlonkVerifier";
const contractName2: string = "Groth16Verifier";

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const deployHelper1 = new DeployHelper(deployer);
  await deployHelper1.beforeDeploy();
  const contractFactory1 = await ethers.getContractFactory(
    contractName1
  );
  const contract1 = await contractFactory1.deploy();
  await contract1.deployed();
  await deployHelper1.afterDeploy(contract1, contractName1);

  const deployHelper2 = new DeployHelper(deployer);
  await deployHelper2.beforeDeploy();
  const contractFactory2 = await ethers.getContractFactory(
    contractName2
  );
  const contract2 = await contractFactory2.deploy();
  await contract2.deployed();
  await deployHelper2.afterDeploy(contract2, contractName2);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
