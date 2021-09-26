// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IHeroPrimeManager {
    
    function feeAddress() external view returns (address);
    function feeMarketRate() external view returns (uint256);
    function divPercent() external view returns (uint256);
    function generation(string memory field, uint id) external view returns (uint256);
}