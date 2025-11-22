// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ArchitexToken
 * @dev ARCHI is the governance and utility token for the Architex ecosystem.
 * It has a fixed initial supply of 1 Billion.
 */
contract ArchitexToken is ERC20, Ownable {
    
    uint256 private constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;

    constructor() ERC20("ArchitexToken", "ARCHI") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
