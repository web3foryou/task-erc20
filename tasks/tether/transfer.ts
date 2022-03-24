import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("transferUsdt", "transferUsdt")
    .addParam("address", "The account address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        let CONTRACT_TETHER = process.env.CONTRACT_TETHER as string;
        if (hre.hardhatArguments.network == "rinkeby") {
            CONTRACT_TETHER = process.env.CONTRACT_TETHER_RINKEBY as string;
        }

        const ContractArtifact = require('../../artifacts/contracts/USDT.sol/TetherToken.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_TETHER, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let tx = await contractSigner.transfer(taskArgs.address, taskArgs.amount);

        await tx.wait();

        let balance = await contractSigner.balanceOf(taskArgs.address);

        console.log("Balance: " + balance);
    });

