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
    
    // 1 billion tokens, adjusted for 18 decimal places (standard)
    uint256 private constant INITIAL_SUPPLY = 1_000_000_000 * 10**18;

    constructor() ERC20("ArchitexToken", "ARCHI") Ownable(msg.sender) {
        // يتم سك (Mint) العملات المليارية مباشرة إلى محفظة المالك عند النشر
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // هذه الدالة تضمن عدم سك عملات جديدة (Minting) بعد الإطلاق، مما يجعل الإمداد ثابتاً.
    function mint(address to, uint256 amount) public pure override {
        revert("Fixed supply token: Cannot mint after deployment");
    }
}
