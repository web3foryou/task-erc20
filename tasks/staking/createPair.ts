import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("createPair", "createPair")
    .setAction(async (taskArgs, hre) => {
        let contractAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
        let CONTRACT_ERC20 = process.env.CONTRACT_ERC20 as string;
        let CONTRACT_TETHER = process.env.CONTRACT_TETHER as string;
        if (hre.hardhatArguments.network == "rinkeby") {
            CONTRACT_ERC20 = process.env.CONTRACT_ERC20_RINKEBY as string;
            CONTRACT_TETHER = process.env.CONTRACT_TETHER_RINKEBY as string;
        } else if (hre.hardhatArguments.network == "ropsten") {
            CONTRACT_ERC20 = process.env.CONTRACT_ERC20_ROPSTEN as string;
            CONTRACT_TETHER = process.env.CONTRACT_ERC20_ROPSTEN as string;
        }

        const ContractArtifact = require('../../artifacts/contracts/IUniswapV2Factory.sol/IUniswapV2Factory.json');

        const [signer] = await hre.ethers.getSigners();

        console.log("CONTRACT_ERC20: " + CONTRACT_ERC20)
        console.log("CONTRACT_TETHER: " + CONTRACT_TETHER)

        let contract = new hre.ethers.Contract(contractAddress, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        // let data = await contractSigner.createPair(CONTRACT_ERC20, CONTRACT_TETHER, {
        //     // gasLimit: 19100000,
        //     // gasPrice: 8000000000
        // });
        // let data = await contractSigner.callStatic.createPair(CONTRACT_ERC20, CONTRACT_TETHER, {
        //     gasLimit: 19100000,
        //     gasPrice: 8000000000
        // });
        let data = await contractSigner.createPair(CONTRACT_ERC20, CONTRACT_TETHER, {
            // gasLimit: 2100000,
            // gasPrice: 8000000000
        });

        await data.wait();

        console.log("done")
    });

