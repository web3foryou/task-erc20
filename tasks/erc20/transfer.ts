import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transferErc20", "transferErc20")
    .addParam("address", "The account address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        const CONTRACT_ERC20 = process.env.CONTRACT_ERC20 as string;

        const ContractArtifact = require('../../artifacts/contracts/ApolERC20.sol/ApolERC20.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_ERC20, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let tx = await contractSigner.transfer(taskArgs.address, taskArgs.amount);

        await tx.wait();

        let balance = await contractSigner.balanceOf(taskArgs.address);

        console.log("Balance: " + balance);
    });

