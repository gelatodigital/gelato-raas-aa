// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract SimpleCounterUser {
    uint256 public counter;
    mapping(address=> uint) public incrementsByUser;
    event IncrementCounter(uint256 newCounterValue, address msgSender);

    function increment() external {
        counter++;
        incrementsByUser[msg.sender]++;
        emit IncrementCounter(counter, msg.sender);
    }
}
