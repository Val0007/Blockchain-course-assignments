// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract MyContract {
  uint256 public myNumber;

  constructor(uint256 _myNumber) {
    myNumber = _myNumber;
  }

  function setMyNumber(uint256 _myNumber) public {
    myNumber = _myNumber;
  }

  function getMyNumber() public view returns(uint256) {
    return myNumber;
  }
}