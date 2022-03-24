import { ethers } from "hardhat";
import {network} from 'hardhat'
import {Contracts} from "../../app/contracts";

async function main() {
  let contracts = new Contracts(network.name);

  const nameStaking = "Staking";
  const stakingFactory = await ethers.getContractFactory("Staking");
  const staking = await stakingFactory.deploy(nameStaking, contracts.LP, contracts.ERC20);
  await staking.deployed();

  console.log("staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
