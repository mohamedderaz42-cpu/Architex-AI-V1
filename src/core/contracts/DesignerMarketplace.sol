// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DesignerMarketplace is ReentrancyGuard, Ownable, Pausable {

    address public treasuryAddress;
    uint256 public constant PLATFORM_FEE_BPS = 1000; // 10%

    event DesignPurchased(uint256 indexed designId, address indexed buyer, address indexed creator, uint256 price, uint256 fee);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    error InvalidPrice();
    error InvalidTreasury();
    error InvalidCreator();
    error TransferFailed();

    constructor(address _treasury) Ownable(msg.sender) {
        if (_treasury == address(0)) revert InvalidTreasury();
        treasuryAddress = _treasury;
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        if (_newTreasury == address(0)) revert InvalidTreasury();
        emit TreasuryUpdated(treasuryAddress, _newTreasury);
        treasuryAddress = _newTreasury;
    }

    function purchaseDesign(uint256 designId, address payable creator) external payable nonReentrant whenNotPaused {
        if (msg.value == 0) revert InvalidPrice();
        if (creator == address(0)) revert InvalidCreator();

        uint256 feeAmount = (msg.value * PLATFORM_FEE_BPS) / 10000;
        uint256 creatorAmount = msg.value - feeAmount;

        (bool treasurySuccess, ) = treasuryAddress.call{value: feeAmount}("");
        if (!treasurySuccess) revert TransferFailed();

        (bool creatorSuccess, ) = creator.call{value: creatorAmount}("");
        if (!creatorSuccess) revert TransferFailed();

        emit DesignPurchased(designId, msg.sender, creator, msg.value, feeAmount);
    }
}
