import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transferUsdt", "transferUsdt")
    .addParam("address", "The account address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        let CONTRACT_TETHER_ADDRESS = process.env.CONTRACT_TETHER_ADDRESS as string;
        if (hre.hardhatArguments.network == "rinkeby") {
            CONTRACT_TETHER_ADDRESS = process.env.CONTRACT_TETHER_ADDRESS_RINKEBY as string;
        }

        const ContractArtifact = require('../../artifacts/contracts/USDT.sol/TetherToken.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_TETHER_ADDRESS, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let tx = await contractSigner.transfer(taskArgs.address, taskArgs.amount);

        await tx.wait();

        let balance = await contractSigner.balanceOf(taskArgs.address);

        console.log("Balance: " + balance);
    });

