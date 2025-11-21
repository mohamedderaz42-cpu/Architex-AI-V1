// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimeLockController.sol";

/**
 * @title ArchitexTimeLock
 * @dev TimeLock is necessary for the DAO to delay execution of community-voted changes (e.g., changing fees).
 * This prevents malicious or hasty decisions.
 */
contract ArchitexTimeLock is TimeLockController {
    // --- State Variables ---
    uint256 public constant MIN_DELAY = 1 days; // Minimum 24 hour delay for any voted action

    // --- Roles (Timelock Specific) ---
    // The Address that can propose changes (e.g., the Governor Contract)
    address[] private PROPOSERS = [msg.sender]; 
    
    // The Address that can cancel proposals (e.g., the Governor Contract)
    address[] private EXECUTORS = [address(0)]; // By default, everyone can execute if delay passed

    constructor(address initialAdmin) 
        TimeLockController(MIN_DELAY, PROPOSERS, EXECUTORS, initialAdmin) 
    {}

    // Optional function to update delay later (requires governance vote)
    function updateMinDelay(uint256 newDelay) external onlyAdmin {
        _setMinDelay(newDelay);
    }
}
