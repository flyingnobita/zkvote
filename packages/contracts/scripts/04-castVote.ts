import { ethers } from "hardhat";
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { FullProof, generateProof } from "@semaphore-protocol/proof"
import { Contract as semaphoreVotingAddress } from "../frontend/SemaphoreVoting_address.json";

const pollId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("pollId"));
const merkleTreeDepth = 20;
const encryptionKey = 0;

const wasmFilePath = `./snark-artifacts/${merkleTreeDepth}/semaphore.wasm`
const zkeyFilePath = `./snark-artifacts/${merkleTreeDepth}/semaphore.zkey`

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();

  const semaphoreVoting = await ethers.getContractAt("SemaphoreVoting", semaphoreVotingAddress);

  const identity = new Identity("test")

  await semaphoreVoting.addVoter(pollId, identity.commitment)
  await semaphoreVoting.startPoll(pollId, encryptionKey);
//   await semaphoreVoting.connect(accounts[1]).addVoter(pollId, BigInt(1))

  const vote = 1
  const group = new Group(pollId, merkleTreeDepth)
  
  group.addMember(identity.commitment)

  const fullProof = await generateProof(identity, group, pollId, vote, {
      wasmFilePath,
      zkeyFilePath
  })

  await semaphoreVoting.castVote(vote, fullProof.nullifierHash, pollId, fullProof.proof);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

