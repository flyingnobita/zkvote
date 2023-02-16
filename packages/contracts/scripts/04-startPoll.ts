import { ethers } from "hardhat";
import { Contract as semaphoreVotingAddress } from "../frontend/SemaphoreVoting_address.json";

const pollId = 1;
const encryptionKey = 0;

async function main(): Promise<void> {
  const semaphoreVoting = await ethers.getContractAt("SemaphoreVoting", semaphoreVotingAddress);

  await semaphoreVoting.startPoll(pollId, encryptionKey);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

