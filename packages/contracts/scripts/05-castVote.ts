import { ethers } from "hardhat";
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { Contract as semaphoreVotingAddress } from "../frontend/SemaphoreVoting_address.json";

const pollId = 1;
const merkleTreeDepth = 20;

const wasmFilePath = `./snark-artifacts/${merkleTreeDepth}/semaphore.wasm`
const zkeyFilePath = `./snark-artifacts/${merkleTreeDepth}/semaphore.zkey`

async function main(): Promise<void> {
  const semaphoreVoting = await ethers.getContractAt("SemaphoreVoting", semaphoreVotingAddress);

  const vote = 1
  const group = new Group(pollId, merkleTreeDepth)

  const identity = new Identity("test")
  group.addMember(identity.commitment)

  const fullProof = await generateProof(identity, group, pollId, vote, {
    wasmFilePath,
    zkeyFilePath
  })
  console.log(semaphoreVotingAddress)

  await semaphoreVoting.castVote(vote, fullProof.nullifierHash, pollId, fullProof.proof);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

