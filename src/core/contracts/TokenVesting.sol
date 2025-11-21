// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract TokenVesting is Context, Ownable {

    struct VestingSchedule {
        address beneficiary;
        uint256 amount;
        uint64 startTime;
        uint64 endTime; // Vesting duration end time
        uint64 cliffTime; // Time before first release is possible
        uint256 releasedAmount;
    }

    mapping(bytes32 => VestingSchedule) public vestingSchedules;
    IERC20 public token;
    
    // Custom Errors
    error ScheduleNotFound();
    error ScheduleOngoing();
    error NoTokensToRelease();

    constructor(address _tokenAddress) Ownable(_msgSender()) {
        require(_tokenAddress != address(0), "Invalid token address");
        token = IERC20(_tokenAddress);
    }

    /**
     * @notice Creates a new vesting schedule.
     */
    function createVestingSchedule(
        bytes32 scheduleId,
        address _beneficiary,
        uint256 _amount,
        uint64 _startTime,
        uint64 _cliffTime,
        uint64 _endTime
    ) external onlyOwner {
        require(vestingSchedules[scheduleId].beneficiary == address(0), "ID already used");
        // Token transfer must be approved by the owner before calling this
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        vestingSchedules[scheduleId] = VestingSchedule({
            beneficiary: _beneficiary,
            amount: _amount,
            startTime: _startTime,
            endTime: _endTime,
            cliffTime: _cliffTime,
            releasedAmount: 0
        });
    }

    /**
     * @notice Calculates the number of tokens releasable at the current time.
     */
    function calculateReleasable(bytes32 scheduleId) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[scheduleId];
        if (schedule.releasedAmount == schedule.amount) return 0;
        if (block.timestamp < schedule.startTime + schedule.cliffTime) return 0;

        uint256 totalDuration = schedule.endTime - schedule.startTime;
        uint256 timeElapsed = block.timestamp - schedule.startTime;
        
        // Calculate proportional release amount
        uint256 totalReleasable = (schedule.amount * timeElapsed) / totalDuration;
        
        // Subtract already released tokens
        return totalReleasable - schedule.releasedAmount;
    }

    /**
     * @notice Releases vested tokens to the beneficiary.
     */
    function release(bytes32 scheduleId) external {
        VestingSchedule storage schedule = vestingSchedules[scheduleId];
        require(schedule.beneficiary == _msgSender(), "Unauthorized beneficiary");
        
        uint256 releasable = calculateReleasable(scheduleId);
        if (releasable == 0) revert NoTokensToRelease();
        
        schedule.releasedAmount += releasable;
        require(token.transfer(schedule.beneficiary, releasable), "Token transfer failed");
    }
}
