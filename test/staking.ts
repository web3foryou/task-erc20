import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  async function deploy() : Promise<any> {
    const nameLp = "LP Token";
    const symbolLp = "LP";
    const lpFactory = await ethers.getContractFactory("LpToken");
    let mintBalanceLp = ethers.utils.parseEther("1000000.0");
    const lp = await lpFactory.deploy(nameLp, symbolLp, mintBalanceLp);
    await lp.deployed();

    const nameErc20 = "ERC20";
    const symbolErc20 = "ERC20";
    let mintBalanceErc20 = ethers.utils.parseEther("0");
    const erc20Factory = await ethers.getContractFactory("ApolERC20");
    const erc20 = await erc20Factory.deploy(nameErc20, symbolErc20, mintBalanceErc20, 18);
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
    await expect(staking.unstake()).to.be.revertedWith('No amount unstake');

    let stakingAmountBad = ethers.utils.parseEther("1.1");
    await lp.approve(staking.address, stakingAmount);
    await expect(staking.stake(stakingAmountBad)).to.be.revertedWith('No amount stake');
  });

  it("claim", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, erc20, staking] = await deploy();

    let stakingAmount = ethers.utils.parseEther("1.0");
    let rewardsAmount = ethers.utils.parseEther("1000.0");
    const prcReward = 20;

    // вывод без баланса
    await expect(staking.claim()).to.be.revertedWith('Zero balance.');

    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await erc20.mint(staking.address, rewardsAmount);

    // вывод через половину времени
    await ethers.provider.send("evm_increaseTime", [600]);
    await ethers.provider.send("evm_mine", []);
    // вывод через половину времени
    await expect(staking.claim()).to.be.revertedWith('Time error.');

    // вывод через один период ревардов
    await ethers.provider.send("evm_increaseTime", [600]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    let totalRewards = ethers.BigNumber.from((Number(stakingAmount) * prcReward / 100).toString());
    expect(await erc20.balanceOf(user.address)).to.equal(totalRewards);

    // вывод через +2 периода ревардов
    await ethers.provider.send("evm_increaseTime", [2400]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    totalRewards = ethers.BigNumber.from((3 * Number(stakingAmount) * prcReward / 100).toString());
    expect(await erc20.balanceOf(user.address)).to.equal(totalRewards);

    // вывод через +4 периода ревардов
    await ethers.provider.send("evm_increaseTime", [4800]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    totalRewards = ethers.BigNumber.from((7 * Number(stakingAmount) * prcReward / 100).toString());
    expect(await erc20.balanceOf(user.address)).to.equal(totalRewards);

  });

  it("changeTimeReward", async function () {
    const [, , staking] = await deploy();

    const timeRewardNew = 1000;

    await staking.changeTimeReward(timeRewardNew);
    expect(await staking.timeReward()).to.equal(timeRewardNew);
  });

  it("changePrcReward", async function () {
    const [user, user2, user3] = await ethers.getSigners();

    const [, , staking] = await deploy();

    const prcRewardNew = 10;

    await staking.changePrcReward(prcRewardNew);
    expect(await staking.prcReward()).to.equal(prcRewardNew);

    await expect(staking.connect(user2).changePrcReward(prcRewardNew)).to.be.revertedWith('Restricted to members.');
  });


  it("double stake", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, erc20, staking] = await deploy();

    let stakingAmount = ethers.utils.parseEther("1.0");
    let rewardsAmount = ethers.utils.parseEther("1000.0");
    const prcReward = 20;

    // вывод без баланса
    await expect(staking.claim()).to.be.revertedWith('Zero balance.');

    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await erc20.mint(staking.address, rewardsAmount);

    // второй стэйк после одного периода + вывод
    await ethers.provider.send("evm_increaseTime", [1200]);
    await ethers.provider.send("evm_mine", []);
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await ethers.provider.send("evm_increaseTime", [1200]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    let totalRewards = ethers.BigNumber.from((3 * Number(stakingAmount) * prcReward / 100).toString());
    expect(await erc20.balanceOf(user.address)).to.equal(totalRewards);

    // ветка со дополнительным стейком без эмуляции времени
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);

  });
});