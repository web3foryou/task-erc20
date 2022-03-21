import { expect } from "chai";
import { ethers } from "hardhat";

describe("ApolERC20", function () {
  it("Name, symbol, decimals", async function () {
    const name = "TestName";
    const symbol = "TestSymbol";

    const erc20Factory = await ethers.getContractFactory("ApolERC20");
    const erc20 = await erc20Factory.deploy(name, symbol, 18);
    await erc20.deployed();

    expect(await erc20.name()).to.equal(name);
    expect(await erc20.symbol()).to.equal(symbol);
    expect(await erc20.decimals()).to.equal(18);
  });

  it("Mint, burn, totalSupply", async function () {
    const name = "TestName";
    const symbol = "TestSymbol";

    const [user, user2] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ApolERC20");
    const erc20 = await erc20Factory.deploy(name, symbol, 18);
    await erc20.deployed();

    let mintBalance = ethers.utils.parseEther("1000000.0");
    let burnBalance = ethers.utils.parseEther("2000000.0");

    // mint
    await expect(erc20.mint(ethers.constants.AddressZero, mintBalance)).to.be.revertedWith('mint to the zero address');
    await erc20.mint(user.address, mintBalance);
    expect(await erc20.totalSupply()).to.equal(mintBalance);
    await expect(erc20.connect(user2).mint(user.address, mintBalance)).to.be.revertedWith('Not owner');

    //burn
    await expect(erc20.burn(ethers.constants.AddressZero, mintBalance)).to.be.revertedWith('burn to the zero address');
    await expect(erc20.burn(user.address, burnBalance)).to.be.revertedWith('insufficient balance');
    await erc20.burn(user.address, mintBalance);
    expect(await erc20.totalSupply()).to.equal(0);
    await expect(erc20.connect(user2).burn(user.address, mintBalance)).to.be.revertedWith('Not owner');
  });

  it("balanceOf, transfer", async function () {
    const name = "TestName";
    const symbol = "TestSymbol";

    const [user, user2] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ApolERC20");
    const erc20 = await erc20Factory.deploy(name, symbol, 18);
    await erc20.deployed();

    let mintBalance = ethers.utils.parseEther("1.0");

    await erc20.mint(user.address, mintBalance);

    expect(await erc20.balanceOf(user.address)).to.equal(mintBalance);

    let transferAmount = ethers.utils.parseEther("1.0");

    await erc20.transfer(user2.address, transferAmount);

    expect(await erc20.balanceOf(user2.address)).to.equal(transferAmount);

    expect(erc20.transfer(user2.address, transferAmount)).to.be.revertedWith('insufficient balance');

    await expect(erc20.transfer(ethers.constants.AddressZero, transferAmount)).to.be.revertedWith('transfer to the zero address');
  });

  it("allowance, approve, transferFrom, increaseAllowance, decreaseAllowance", async function () {
    const name = "TestName";
    const symbol = "TestSymbol";

    const [user, user2, user3] = await ethers.getSigners();

    const erc20Factory = await ethers.getContractFactory("ApolERC20");
    const erc20 = await erc20Factory.deploy(name, symbol, 18);
    await erc20.deployed();

    let mintBalance = ethers.utils.parseEther("1.0");

    await erc20.mint(user.address, mintBalance);

    let transferAmount = ethers.utils.parseEther("1.0");

    await erc20.approve(user2.address, transferAmount);

    await expect(erc20.approve(ethers.constants.AddressZero, transferAmount))
        .to.be.revertedWith('approve to the zero address');

    expect(await erc20.allowance(user.address, user2.address)).to.equal(transferAmount);

    await erc20.connect(user2).transferFrom(user.address, user3.address, transferAmount);

    expect(await erc20.allowance(user.address, user2.address)).to.equal(0);

    expect(await erc20.balanceOf(user3.address)).to.equal(transferAmount);

    await expect(erc20.connect(user2).transferFrom(ethers.constants.AddressZero, user3.address, transferAmount))
        .to.be.revertedWith('transfer from the zero address');

    await expect(erc20.connect(user2).transferFrom(user.address, ethers.constants.AddressZero, transferAmount))
        .to.be.revertedWith('transfer to the zero address');

    await expect(erc20.connect(user2).transferFrom(user.address, user3.address, transferAmount))
        .to.be.revertedWith('insufficient balance allowances');

    await erc20.approve(user2.address, transferAmount);

    await expect(erc20.connect(user2).transferFrom(user.address, user3.address, transferAmount))
        .to.be.revertedWith('insufficient balance sender');

    await erc20.increaseAllowance(user2.address, transferAmount);

    expect(await erc20.allowance(user.address, user2.address)).to.equal(transferAmount.add(transferAmount));

    await erc20.decreaseAllowance(user2.address, transferAmount);

    expect(await erc20.allowance(user.address, user2.address)).to.equal(transferAmount);

    await expect(erc20.decreaseAllowance(user2.address, transferAmount.add(transferAmount)))
        .to.be.revertedWith('dont have amount');
  });
});
