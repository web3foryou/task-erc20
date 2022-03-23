import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  async function deploy() : Promise<any> {
    const nameLp = "LP Token";
    const symbolLp = "LP";
    const lpFactory = await ethers.getContractFactory("LpToken");
    let mintBalance = ethers.utils.parseEther("1000000.0");
    const lp = await lpFactory.deploy(nameLp, symbolLp, mintBalance);
    await lp.deployed();

    const nameErc20 = "ERC20";
    const symbolErc20 = "ERC20";
    const erc20Factory = await ethers.getContractFactory("ApolERC20");
    const erc20 = await erc20Factory.deploy(nameErc20, symbolErc20, 18);
    await erc20.deployed();

    const nameStaking = "Staking";
    const stakingFactory = await ethers.getContractFactory("Staking");
    const staking = await stakingFactory.deploy(nameStaking, lp.address, erc20.address);
    await staking.deployed();

    return [lp, erc20, staking];
  }

  it("name, stake, balanceOf, unstake, claim", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, erc20, staking] = await deploy();
    const nameStaking = "Staking";

    expect(await staking.name()).to.equal(nameStaking);
    await staking.testAccess();
    expect(await staking.test()).to.equal(true);

    await expect(staking.connect(user2).testAccess())
        .to.be.revertedWith('Restricted to members.');

    let stakingAmount = ethers.utils.parseEther("1.0");
    const prcReward = 20;
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    expect(await staking.balanceOf(user.address)).to.equal(stakingAmount);
    expect(await lp.balanceOf(staking.address)).to.equal(stakingAmount);

    await expect(staking.unstake()).to.be.revertedWith('Time error.');

    await ethers.provider.send("evm_increaseTime", [1200]);
    await ethers.provider.send("evm_mine", []);

    await staking.unstake();
    expect(await staking.balanceOf(user.address)).to.equal(0);
    expect(await lp.balanceOf(staking.address)).to.equal(0);
  });

  it("claim", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, erc20, staking] = await deploy();

    let stakingAmount = ethers.utils.parseEther("1.0");
    let rewardsAmount = ethers.utils.parseEther("1000.0");
    const prcReward = 20;
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await erc20.mint(staking.address, rewardsAmount);
    expect(await erc20.balanceOf(staking.address)).to.equal(rewardsAmount);

    await ethers.provider.send("evm_increaseTime", [1200]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    expect(await erc20.balanceOf(user.address)).to.equal(ethers.BigNumber.from((Number(stakingAmount) * prcReward / 100).toString()));
  });

  it("changeTimeReward", async function () {
    const [, , staking] = await deploy();

    const timeRewardNew = 1000;

    await staking.changeTimeReward(timeRewardNew);
    expect(await staking.timeReward()).to.equal(timeRewardNew);
  });

  it("changePrcReward", async function () {
    const [, , staking] = await deploy();

    const prcRewardNew = 10;

    await staking.changePrcReward(prcRewardNew);
    expect(await staking.prcReward()).to.equal(prcRewardNew);
  });
});