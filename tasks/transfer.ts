import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transfer", "transfer")
    .addParam("address", "The account address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        const CONTRACT_ERC20_ADDRESS = process.env.CONTRACT_ERC20_ADDRESS as string;

        const ContractArtifact = require('./../artifacts/contracts/ERC20.sol/ERC20.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_ERC20_ADDRESS, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let tx = await contractSigner.transfer(taskArgs.address, taskArgs.amount);

        await tx.wait();

        let balance = await contractSigner.balanceOf(taskArgs.address);

        console.log("Balance: " + balance);
    });

