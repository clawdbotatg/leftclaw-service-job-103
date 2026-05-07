// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GuestBook
 * @notice A simple on-chain guest book. Users sign by leaving a message.
 *         Entries are stored permanently on-chain.
 */
contract GuestBook is Ownable2Step, ReentrancyGuard {
    struct Entry {
        address signer;
        string message;
        uint256 timestamp;
    }

    uint256 public constant MAX_MESSAGE_LENGTH = 280;

    Entry[] private _entries;

    event EntryAdded(address indexed signer, string message, uint256 timestamp);

    error EmptyMessage();
    error MessageTooLong();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Sign the guest book with a message.
     * @param message The message to record. Must be non-empty and at most MAX_MESSAGE_LENGTH bytes.
     */
    function sign(string calldata message) external nonReentrant {
        uint256 len = bytes(message).length;
        if (len == 0) revert EmptyMessage();
        if (len > MAX_MESSAGE_LENGTH) revert MessageTooLong();

        _entries.push(Entry({ signer: msg.sender, message: message, timestamp: block.timestamp }));

        emit EntryAdded(msg.sender, message, block.timestamp);
    }

    /**
     * @notice Returns all entries in the guest book.
     */
    function getEntries() external view returns (Entry[] memory) {
        return _entries;
    }

    /**
     * @notice Returns the total number of entries.
     */
    function getEntryCount() external view returns (uint256) {
        return _entries.length;
    }
}
