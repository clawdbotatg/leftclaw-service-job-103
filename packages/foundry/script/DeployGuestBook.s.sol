// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import { GuestBook } from "../contracts/GuestBook.sol";

/**
 * @notice Deploy script for GuestBook contract.
 * @dev Deploys GuestBook with the deployer as initial owner, then initiates
 *      a 2-step ownership transfer to the client wallet.
 *
 * Example:
 * yarn deploy --file DeployGuestBook.s.sol  # local anvil chain
 * yarn deploy --file DeployGuestBook.s.sol --network base # live network
 */
contract DeployGuestBook is ScaffoldETHDeploy {
    address constant CLIENT_WALLET = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

    function run() external ScaffoldEthDeployerRunner {
        GuestBook guestBook = new GuestBook(deployer);
        deployments.push(Deployment("GuestBook", address(guestBook)));

        guestBook.transferOwnership(CLIENT_WALLET);

        console.logString(string.concat("GuestBook deployed at: ", vm.toString(address(guestBook))));
        console.logString("Ownership transfer initiated to client wallet");
    }
}
