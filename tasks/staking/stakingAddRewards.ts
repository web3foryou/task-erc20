import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/contracts";

task("stakingAddRewards", "stakingAddRewards")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        const ContractArtifact = require('../../artifacts/contracts/ApolERC20.sol/ApolERC20.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(contracts.ERC20, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let amount = hre.ethers.utils.parseEther("100");

        console.log("Balance: " + await contractSigner.balanceOf(contracts.STAKING));

        let tx = await contractSigner.transfer(contracts.STAKING, amount);
        await tx.wait();

        console.log("Balance: " + await contractSigner.balanceOf(contracts.STAKING));
    });

