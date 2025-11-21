// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StakingIncentives is Ownable, ReentrancyGuard {
    
    IERC20 public stakingToken; // The Liquidity Token (LP Token) to be deposited
    IERC20 public rewardToken;  // The ARCHI token used for rewards

    uint256 public rewardRatePerSecond;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public stakedAmounts;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public userRewardPerTokenPaid;

    // Custom Errors
    error ZeroAmount();
    error TransferFailed();
    error TokenAddressZero();

    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        if (_stakingToken == address(0) || _rewardToken == address(0)) revert TokenAddressZero();
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = getRewardPerToken();
        lastUpdateTime = block.timestamp;
        rewards[account] = earned(account);
        _;
        userRewardPerTokenPaid[account] = rewardPerTokenStored;
    }

    function getRewardPerToken() public view returns (uint256) {
        if (stakingToken.totalSupply() == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + 
               (rewardRatePerSecond * (block.timestamp - lastUpdateTime) * 1e18) / stakingToken.totalSupply();
    }

    function earned(address account) public view returns (uint256) {
        return (stakedAmounts[account] * (getRewardPerToken() - userRewardPerTokenPaid[account])) / 1e18 + rewards[account];
    }

    function stake(uint256 amount) external nonReentrancy updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        stakedAmounts[msg.sender] += amount;
        if (!stakingToken.transferFrom(msg.sender, address(this), amount)) revert TransferFailed();
    }

    function withdraw(uint256 amount) external nonReentrancy updateReward(msg.sender) {
        if (amount == 0 || amount > stakedAmounts[msg.sender]) revert ZeroAmount();
        stakedAmounts[msg.sender] -= amount;
        if (!stakingToken.transfer(msg.sender, amount)) revert TransferFailed();
    }

    function claimReward() external nonReentrancy updateReward(msg.sender) {
        uint256 rewardAmount = rewards[msg.sender];
        if (rewardAmount == 0) revert NoTokensToRelease();

        rewards[msg.sender] = 0;
        if (!rewardToken.transfer(msg.sender, rewardAmount)) revert TransferFailed();
    }
}
