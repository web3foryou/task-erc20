//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract Staking is AccessControl {
    string public name;
    address public lpToken;
    address public rewardToken;

    mapping(address => uint) private _balances;
    mapping(address => uint) private _timeStake;
    mapping(address => uint) private _rewards;

    uint public timeReward;
    uint public prcReward;

    event Response(bool success, bytes data);

    constructor(string memory _name, address _lpToken, address _rewardToken) {
        name = _name;
        lpToken = _lpToken;
        rewardToken = _rewardToken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        timeReward = 1200;
        prcReward = 20;
    }

    function stake(uint amount) public {
        require(IERC20(lpToken).allowance(msg.sender, address(this)) >= amount, "No amount stake");

        IERC20(lpToken).transferFrom(msg.sender, address(this), amount);

        uint rewardsCount = (block.timestamp - _timeStake[msg.sender]) / timeReward;

        if (rewardsCount > 0) {
            _rewards[msg.sender] += rewardsCount * _balances[msg.sender] * prcReward / 100;
        }

        _balances[msg.sender] += amount;
        _timeStake[msg.sender] = block.timestamp;
    }

    function unstake() public {
        require(_balances[msg.sender] > 0, "No amount unstake");
        require(_timeStake[msg.sender] + timeReward <= block.timestamp, "Time error.");

        uint amount = _balances[msg.sender];
        _balances[msg.sender] = 0;
        IERC20(lpToken).transfer(msg.sender, amount);
    }

    function balanceOf(address _addr) public view returns (uint){
        return _balances[_addr];
    }

    function claim() public {
        require(_timeStake[msg.sender] + timeReward <= block.timestamp, "Time error.");
        require(_balances[msg.sender] > 0, "Zero balance.");

        uint rewardsCount = (block.timestamp - _timeStake[msg.sender]) / timeReward;

        uint amountReward = _rewards[msg.sender] + rewardsCount * _balances[msg.sender] * prcReward / 100;
        _rewards[msg.sender] = 0;

        _timeStake[msg.sender] += rewardsCount * timeReward;

        SafeERC20.safeTransfer(IERC20(rewardToken), msg.sender, amountReward);
    }

    function changeTimeReward(uint _time) public onlyMember {
        timeReward = _time;
    }

    function changePrcReward(uint _prcReward) public onlyMember {
        prcReward = _prcReward;
    }

    modifier onlyMember() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to members.");
        _;
    }
}
