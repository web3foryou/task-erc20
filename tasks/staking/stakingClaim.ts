import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/contracts"

task("stakingClaim", "stakingClaim")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        const [user] = await hre.ethers.getSigners();

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(contracts.STAKING, ContractStakingArtifact.abi, user);
        let contractStakingSigner = contractStaking.connect(user);

        const ContractErc20Artifact = require('../../artifacts/contracts/ApolERC20.sol/ApolERC20.json');
        let contractErc20 = new hre.ethers.Contract(contracts.ERC20, ContractErc20Artifact.abi, user);
        let contractErc20Signer = contractStaking.connect(user);

        console.log("balanceOf: " + await contractErc20.balanceOf(user.address));
        await contractStakingSigner.claim();
        console.log("balanceOf: " + await contractErc20.balanceOf(user.address));

        console.log("done")
    });

