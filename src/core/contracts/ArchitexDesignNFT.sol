// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ArchitexDesignNFT is ERC721, Ownable, Pausable, ReentrancyGuard {
    
    uint256 public mintFee; 
    address public treasuryAddress;
    IERC20 public archiToken; 

    error InvalidFee();
    error TransferFailed();
    
    uint256 private _nextTokenId = 1;

    constructor(
        address _treasuryAddress,
        address _archiTokenAddress,
        uint256 _mintFee
    ) ERC721("Architex Design Asset", "ARCHI_D") Ownable(msg.sender) {
        require(_treasuryAddress != address(0), "Invalid treasury address");
        require(_archiTokenAddress != address(0), "Invalid ARCHI token address");
        require(_mintFee > 0, "Fee must be greater than zero");

        treasuryAddress = _treasuryAddress;
        archiToken = IERC20(_archiTokenAddress);
        mintFee = _mintFee;
    }

    function safeMint(address recipient, string memory tokenURI) public nonReentrant whenNotPaused {
        bool success = archiToken.transferFrom(msg.sender, treasuryAddress, mintFee);
        if (!success) revert TransferFailed();
        
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
    
    function setMintFee(uint256 newFee) external onlyOwner {
        mintFee = newFee;
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        treasuryAddress = newTreasury;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
