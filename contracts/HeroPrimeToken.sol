// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "./Utils.sol";
import "./ERC20.sol";

contract HeroPrimeToken is ERC20 {
    using SafeMath for uint256;
    uint256 public maxSupply = 1 * 10**6 * 10**18;

    uint private temporaryToken = 1 * 10**3 * 10**18;
    address private temporaryUser = 0xaD6bd83D5a0969b1B5d78dd996632C9a10B869B7;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(_msgSender(), maxSupply.sub(temporaryToken));
        _mint(temporaryUser, temporaryToken);
    }

}