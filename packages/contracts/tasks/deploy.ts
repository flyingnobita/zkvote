import { task, types } from "hardhat/config"

// import DeployHelper from "./deploy_helper";

task("deploy", "Deploy a Greeter contract")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {
        const { semaphore } = await run("deploy:semaphore", {
            logs
        })

        const [deployer] = await ethers.getSigners();

        // const deployHelper = new DeployHelper(deployer);
        // await deployHelper.beforeDeploy();
        // const contractFactory = await ethers.getContractFactory(
        //     "SemaphoreVoting"
        // );
        // const contract = await contractFactory.deploy();
        // await contract.deployed();
        // await deployHelper.afterDeploy(contract, "SemaphoreVoting");
    })