import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Contracts} from "../../app/contracts";

task("stakingVerify", "stakingVerify")
    // .addParam("address", "The contract address")
    .setAction(async (taskArgs, hre) => {
        let contracts = new Contracts(hre.hardhatArguments.network as string);

        await hre.run("verify:verify", {
            address: contracts.STAKING,
            constructorArguments: [
                "Staking",
                contracts.LP,
                contracts.ERC20
            ],
        });
    });

