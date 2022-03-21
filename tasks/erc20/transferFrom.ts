import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transferFrom", "transferFrom")
    .addParam("sender", "The sender address")
    .addParam("recipient", "The recipient address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        const CONTRACT_ERC20_ADDRESS = process.env.CONTRACT_ERC20_ADDRESS as string;

        const ContractArtifact = require('../../artifacts/contracts/ApolERC20.sol/ApolERC20.json');

        const [, signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_ERC20_ADDRESS, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        console.log("signer.address: " + signer.address);
        let allowance = await contractSigner.allowance(taskArgs.sender, signer.address);
        console.log("Allowance: " + allowance);

        let tx = await contractSigner.transferFrom(taskArgs.sender, taskArgs.recipient, taskArgs.amount);

        await tx.wait();


        let balance = await contractSigner.balanceOf(taskArgs.recipient);

        console.log("Balance: " + balance);
    });

