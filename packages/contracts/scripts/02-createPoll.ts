import { ethers } from "hardhat";
import { Contract as semaphoreVotingAddress } from "../frontend/SemaphoreVoting_address.json";

const pollId = 1;
const merkleTreeDepth = 20;

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const semaphoreVoting = await ethers.getContractAt("SemaphoreVoting", semaphoreVotingAddress);

  await semaphoreVoting.createPoll(pollId, deployer.address, merkleTreeDepth);
  console.log(`Created poll with pollId ${pollId} and coordinator ${deployer.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
