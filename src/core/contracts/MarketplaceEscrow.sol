// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract MarketplaceEscrow is ReentrancyGuard, Ownable, Pausable {

    enum State { AWAITING_DELIVERY, DELIVERED, COMPLETED, DISPUTED, REFUNDED }

    struct EscrowTx {
        address payable buyer;
        address payable seller;
        uint256 amount;
        State state;
        uint256 createdAt;
        uint256 deliveredAt;
    }

    mapping(uint256 => EscrowTx) public escrows;
    address public arbitrator;

    uint256 public constant AUTO_RELEASE_TIME = 30 days;
    uint256 public constant REFUND_REQUEST_TIME = 60 days;

    event EscrowCreated(uint256 indexed orderId, address indexed buyer, address indexed seller, uint256 amount);
    event MarkedDelivered(uint256 indexed orderId, uint256 timestamp);
    event FundsReleased(uint256 indexed orderId, address indexed recipient);
    event DisputeOpened(uint256 indexed orderId);
    event DisputeResolved(uint256 indexed orderId, address indexed winner);

    error OrderExists();
    error Unauthorized();
    error InvalidState();
    error TimeLockActive();

    constructor(address _arbitrator) Ownable(msg.sender) {
        arbitrator = _arbitrator;
    }

    function createEscrow(uint256 orderId, address payable _seller) external payable whenNotPaused {
        if (escrows[orderId].buyer != address(0)) revert OrderExists();
        escrows[orderId] = EscrowTx(payable(msg.sender), _seller, msg.value, State.AWAITING_DELIVERY, block.timestamp, 0);
        emit EscrowCreated(orderId, msg.sender, _seller, msg.value);
    }

    function markDelivered(uint256 orderId) external {
        EscrowTx storage txn = escrows[orderId];
        if (msg.sender != txn.seller) revert Unauthorized();
        if (txn.state != State.AWAITING_DELIVERY) revert InvalidState();
        txn.state = State.DELIVERED;
        txn.deliveredAt = block.timestamp;
        emit MarkedDelivered(orderId, block.timestamp);
    }

    function confirmDelivery(uint256 orderId) external nonReentrant {
        EscrowTx storage txn = escrows[orderId];
        if (msg.sender != txn.buyer) revert Unauthorized();
        if (txn.state != State.DELIVERED) revert InvalidState();
        txn.state = State.COMPLETED;
        _transfer(txn.seller, txn.amount);
        emit FundsReleased(orderId, txn.seller);
    }

    function autoReleaseFunds(uint256 orderId) external nonReentrant {
        EscrowTx storage txn = escrows[orderId];
        if (msg.sender != txn.seller) revert Unauthorized();
        if (txn.state != State.DELIVERED) revert InvalidState();
        if (block.timestamp < txn.deliveredAt + AUTO_RELEASE_TIME) revert TimeLockActive();
        txn.state = State.COMPLETED;
        _transfer(txn.seller, txn.amount);
        emit FundsReleased(orderId, txn.seller);
    }

    function raiseDispute(uint256 orderId) external {
        EscrowTx storage txn = escrows[orderId];
        if (msg.sender != txn.buyer && msg.sender != txn.seller) revert Unauthorized();
        if (txn.state == State.COMPLETED || txn.state == State.REFUNDED) revert InvalidState();
        txn.state = State.DISPUTED;
        emit DisputeOpened(orderId);
    }

    function resolveDispute(uint256 orderId, address payable winner) external nonReentrant {
        if (msg.sender != arbitrator) revert Unauthorized();
        EscrowTx storage txn = escrows[orderId];
        if (txn.state != State.DISPUTED) revert InvalidState();
        
        if (winner == txn.buyer) {
            txn.state = State.REFUNDED;
            _transfer(txn.buyer, txn.amount);
        } else {
            txn.state = State.COMPLETED;
            _transfer(txn.seller, txn.amount);
        }
        emit DisputeResolved(orderId, winner);
    }

    function _transfer(address payable to, uint256 amt) internal {
        (bool success, ) = to.call{value: amt}("");
        require(success, "Transfer failed");
    }
}
