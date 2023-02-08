import { run, ethers } from "hardhat";
import { Contract as semaphoreVotingAddress } from "../frontend/SemaphoreVoting_address.json";

const pollId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("pollId"));
const encryptionKey = 0;
const merkleTreeDepth = 20;

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const semaphoreVoting = await ethers.getContractAt("SemaphoreVoting", semaphoreVotingAddress);

  await semaphoreVoting.createPoll(pollId, deployer.address, merkleTreeDepth);
  await semaphoreVoting.startPoll(pollId, encryptionKey);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
