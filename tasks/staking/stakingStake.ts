import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/contracts";

task("stakingStake", "stakingStake")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        const [user] = await hre.ethers.getSigners();

        const ContractLPArtifact = require('../../artifacts/contracts/LpToken.sol/LpToken.json');
        let contractLP = new hre.ethers.Contract(contracts.LP, ContractLPArtifact.abi, user);
        let contractLpSigner = contractLP.connect(user);

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(contracts.STAKING, ContractStakingArtifact.abi, user);
        let contractStakingSigner = contractStaking.connect(user);

        let stakingAmount = hre.ethers.utils.parseEther("1.0");
        await contractLpSigner.approve(contracts.STAKING, stakingAmount);
        await contractStakingSigner.stake(stakingAmount);

        console.log("contractStaking balanceOf: " + await contractStakingSigner.balanceOf(user.address));
        console.log("contractLp balanceOf: " + await contractLpSigner.balanceOf(contracts.STAKING));

        console.log("done")
    });

