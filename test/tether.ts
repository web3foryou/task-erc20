import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tether", function () {
  it("Deploy", async function () {
    const name = "Tether";
    const symbol = "USDT";
    const decimals = 6;

    const [user, user2, user3] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("TetherToken");

    let mintBalance = ethers.utils.parseEther("1000000.0");

    const erc20 = await erc20Factory.deploy(mintBalance, name, symbol, decimals);

    expect(await erc20.name()).to.equal(name);
    expect(await erc20.symbol()).to.equal(symbol);
    expect(await erc20.decimals()).to.equal(decimals);
  });


});