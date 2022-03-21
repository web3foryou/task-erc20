import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("approve", "approve")
    .addParam("address", "The account address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        const CONTRACT_ERC20_ADDRESS = process.env.CONTRACT_ERC20_ADDRESS as string;

        const ContractArtifact = require('../../artifacts/contracts/ApolERC20.sol/ApolERC20.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_ERC20_ADDRESS, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let tx = await contractSigner.approve(taskArgs.address, taskArgs.amount);

        await tx.wait();

        let allowance = await contractSigner.allowance(signer.address, taskArgs.address);

        console.log("Allowance: " + allowance);
    });

