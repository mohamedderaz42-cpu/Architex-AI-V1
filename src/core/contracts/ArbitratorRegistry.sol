// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ArbitratorRegistry is Ownable {

    struct Arbitrator {
        bool isRegistered;
        bool isSuspended;
        uint256 securityStake; // Deposit required for incentive
        uint256 totalCases;
        uint256 successfulRulings;
    }

    mapping(address => Arbitrator) public arbitrators;
    address[] public registeredArbitrators;
    
    // --- Custom Errors ---
    error AlreadyRegistered();
    error NotRegistered();
    error InsufficientStake();

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Registers a new arbitrator, requiring an initial security stake (in native coin).
     */
    function registerArbitrator() external payable {
        if (arbitrators[msg.sender].isRegistered) revert AlreadyRegistered();
        if (msg.value < 10 ether) revert InsufficientStake(); // Example stake: 10 PiUSD/Pi
        
        arbitrators[msg.sender] = Arbitrator({
            isRegistered: true,
            isSuspended: false,
            securityStake: msg.value,
            totalCases: 0,
            successfulRulings: 0
        });
        
        registeredArbitrators.push(msg.sender);
    }

    /**
     * @notice Platform owner can suspend arbitrators in case of bad behavior.
     */
    function toggleSuspension(address _arbitrator, bool _status) external onlyOwner {
        if (!arbitrators[_arbitrator].isRegistered) revert NotRegistered();
        arbitrators[_arbitrator].isSuspended = _status;
    }
    
    // The following functions would handle updating successfulRulings and withdrawing stake.
}
