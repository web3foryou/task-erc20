import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("verify2", "verify2")
    .addParam("address", "The contract address")
    .setAction(async (taskArgs, hre) => {
        await hre.run("verify:verify", {
            address: taskArgs.address,
            constructorArguments: [
                "TestName",
                "TestSymbol",
                18,
            ],
        });
    });

