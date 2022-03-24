import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/contracts"

task("stakingChangeTime", "stakingChangeTime")
    .addParam("time", "time")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        const [user] = await hre.ethers.getSigners();

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(contracts.STAKING, ContractStakingArtifact.abi, user);
        let contractStakingSigner = contractStaking.connect(user);

        await contractStakingSigner.changeTimeReward(taskArgs.time);
        console.log("timeReward: " + await contractStakingSigner.timeReward())

        console.log("done")
    });

