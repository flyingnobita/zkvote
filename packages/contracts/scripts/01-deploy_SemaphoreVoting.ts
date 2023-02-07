import { run, ethers } from "hardhat";
import DeployHelper from "./deploy_helper";

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const { semaphoreVerifierAddress, incrementalBinaryTreeAddress } = await run("deploy:semaphore");

  const deployHelper = new DeployHelper(deployer);
  await deployHelper.beforeDeploy();
  const contractFactory = await ethers.getContractFactory(
    "SemaphoreVoting", {
      libraries: {
        IncrementalBinaryTree: incrementalBinaryTreeAddress
      }
    }
  );
  const contract = await contractFactory.deploy(semaphoreVerifierAddress);
  await contract.deployed();
  await deployHelper.afterDeploy(contract, "SemaphoreVoting");
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
