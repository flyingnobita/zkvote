import { run, ethers } from "hardhat";
import DeployHelper from "./utils/deploy-helpers";
import { hexToBytes, fromLittleEndian } from "./utils/utils";
import { schema } from "./polygon-id-constants.json"

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

  // Main validator address on mumbai - https://mumbai.polygonscan.com/address/0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB#code
  // - do not change for testnet
  const validatorAddress = "0xb1e86C4c687B85520eF4fd2a0d14e81970a15aFB";

  const schemaEnd = fromLittleEndian(hexToBytes(schema.hash));
  const query = {
    schema: ethers.BigNumber.from(schemaEnd),
    // slotIndex2 indicates the value stored as Attribute 1 inside the claim
    slotIndex: 2,
    // see - https://0xpolygonid.github.io/tutorials/verifier/verification-library/zk-query-language/
    // 1 = equals
    // 2 = less-than
    // 3 = greater-than
    // 4 = in
    // 5 = not-in
    operator: 3,
    value: [69, ...new Array(63).fill(0).map((i) => 0)],
    circuitId: "credentialAtomicQuerySig",
  };

  // Retrieve contract to interact with it
  const semaphoreVoting = await ethers.getContractAt(
    "SemaphoreVoting",
    contract.address
  );

  // Set zkpRequest for contract
  try {
    // Use as a means to keep track in the contract for number of mints a person can perform from a specific wallet address
    const requestId = Number(await semaphoreVoting.TRANSFER_REQUEST_ID());
    const tx = await semaphoreVoting.setZKPRequest(
      requestId, // 1
      validatorAddress,
      query
    );

    tx.wait();
    // console.log(
    //   `Request set at:\nNOTE: May take a little bit to show up\nhttps://mumbai.polygonscan.com/tx/${tx.hash}`
    // );
  } catch (e) {
    console.error("Error: ", e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
