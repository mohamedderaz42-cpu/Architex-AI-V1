// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ArchitexDesignNFT is ERC721, Ownable, Pausable, nonReentrancy {
    
    // Total cost (fee) to mint an NFT, payable in ARCHI tokens
    uint256 public mintFee; 
    address public treasuryAddress;
    // لتحديد عملة ARCHI التي أنشأناها
    IERC20 public archiToken; 

    // Custom Errors
    error InvalidFee();
    error TransferFailed();
    
    // Token Counter
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

    /**
     * @notice Mints a new NFT representing a unique architectural design.
     * @param recipient The wallet receiving the NFT.
     * @param tokenURI The metadata link (IPFS, etc.) for the design file.
     */
    function safeMint(address recipient, string memory tokenURI) public nonReentrancy whenNotPaused {
        // 1. Payment: The user must approve this contract to spend their ARCHI tokens first.
        bool success = archiToken.transferFrom(msg.sender, treasuryAddress, mintFee);
        if (!success) revert TransferFailed(); // Fail if ARCHI payment transfer fails
        
        // 2. Mint the NFT and link metadata (tokenURI)
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
    
    // --- الوظائف الإدارية ---
    function setMintFee(uint256 newFee) external onlyOwner {
        mintFee = newFee;
    }

    function setTreasuryAddress(address newTreasury) external onlyOwner {
        treasuryAddress = newTreasury;
    }

    // Standard override for metadata retrieval
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
