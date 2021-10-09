// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IHeroPrimeArtifactNFT {
    
    function ownerOf(uint256 tokenId) external view returns (address owner);
    // function heroPrimeLevel(uint256 _tokenId) external view returns (uint256);
    // function exp(uint256 _tokenId, uint256 _exp) external;
    function incrementRolls(uint256 amount, address receiver) external;
    function rollArtifact( uint256 amount, address receiver, uint elementindex ) external;
    function fillOrder(uint256 _tokenId, address sender) external;
    function cancelOrder(uint256 _tokenId, address sender) external;
    function placeOrder(uint256 _tokenId, uint256 _price, address sender) external;
}