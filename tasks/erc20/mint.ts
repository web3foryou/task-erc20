import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("mint", "mint")
    .addParam("address", "The account address")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, hre) => {
        let CONTRACT_ERC20_ADDRESS = process.env.CONTRACT_TETHER_ADDRESS as string;
        if (hre.hardhatArguments.network == "rinkeby") {
            CONTRACT_ERC20_ADDRESS = process.env.CONTRACT_TETHER_ADDRESS_RINKEBY as string;
        } else if (hre.hardhatArguments.network == "ropsten") {
            CONTRACT_ERC20_ADDRESS = process.env.CONTRACT_ERC20_ADDRESS_ROPSTEN as string;
        }

        const ContractArtifact = require('../../artifacts/contracts/ApolERC20.sol/ApolERC20.json');

        const [signer] = await hre.ethers.getSigners();

        let contract = new hre.ethers.Contract(CONTRACT_ERC20_ADDRESS, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let tx = await contractSigner.mint(taskArgs.address, taskArgs.amount, {
            // gasLimit: 10000000,
            // gasPrice: 900000000
            // gasLimit: 2100000,
            // gasPrice: 8000000000
        });

        await tx.wait();

        let balance = await contractSigner.balanceOf(taskArgs.address);

        console.log("Total balance: " + balance);
    });

