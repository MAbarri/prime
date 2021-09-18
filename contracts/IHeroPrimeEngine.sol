// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IHeroPrimeEngine {
    
    function battle(address sender, uint256 _tokenId, uint _monsterLevelIndex) external returns(uint result);
}