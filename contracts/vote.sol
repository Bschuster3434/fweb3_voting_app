// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Poll {
  IERC20 private _token;
  address public owner;
  uint yesVoters;
  uint totalVoters;
  mapping(address => bool) voted;

  constructor(IERC20 token) {
    owner = msg.sender;
    _token = token;
  }

  function hasTokens(address voter) view private returns (bool) {
    return _token.balanceOf(voter) >= 100 * 10**18;
  }

  function hasVoted(address voter) view private returns (bool) {
    return voted[voter];
  }

  function haveIVoted() view external returns (bool) {
    return voted[msg.sender];
  }

  function voteYes() public {
    require(!hasVoted(msg.sender), "You already voted");
    require(hasTokens(msg.sender), "Need 100 FWEB3 tokens to vote");
    yesVoters++;
    totalVoters++;
    voted[msg.sender] = true;
  }

  function voteNo() public {
    require(!hasVoted(msg.sender), "You already voted");
    require(hasTokens(msg.sender), "Need 100 FWEB3 tokens to vote");
    totalVoters++;
    voted[msg.sender] = true;
  }

  function getNumVoters() public view returns (uint) {
    return totalVoters;
  }

  function getYesPercentage() public view returns (uint) {
    return yesVoters * 100 / getNumVoters();
  }
}