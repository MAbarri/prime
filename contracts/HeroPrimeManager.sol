// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./IHeroPrimeNFT.sol";
import "./IERC20.sol";
import "./IHeroPrimeEngine.sol";

contract HeroPrimeManager is Context, Ownable {
    using SafeMath for uint256;

    uint public _rollHeroPrice = 200 * 10**18;
    uint public _attackFee = 1 * 10**18;
    uint public feeMarketRate = 1;
    uint public divPercent = 10;


    IHeroPrimeNFT internal heroPrimeNFT;
    IERC20 internal heroPrimeToken;
    IHeroPrimeEngine internal heroPrimeEngine;

    address public feeAddress;

    constructor(address token, address nft, address engine){
        heroPrimeNFT = IHeroPrimeNFT(nft);
        heroPrimeToken = IERC20(token);
        heroPrimeEngine = IHeroPrimeEngine(engine);
        feeAddress = address(this);
    }

    function setAttackFee(uint _fee) external onlyOwner{
        _attackFee = _fee;
    }

    function setRollHeroPrice(uint _fee) external onlyOwner{
        _rollHeroPrice = _fee;
    }
    function setFeeAddress(address _feeaddress) external onlyOwner{
        feeAddress = _feeaddress;
    }
    function setFeeMarketRate(uint newRate) external onlyOwner{
        feeMarketRate = newRate;
    }
    function setDivPercent(uint _divPercent) external onlyOwner{
        divPercent = _divPercent;
    }
    // battle external function

    function attackMonster(uint _tokenId, uint _monster) external {
        require(heroPrimeToken.transferFrom(_msgSender(), address(this), _attackFee));
        heroPrimeEngine.battle(_msgSender(), _tokenId, _monster);
    }
    
    // rollHeroPrice
    function buyHeroRolls(uint amount) external {
        require(heroPrimeToken.transferFrom(_msgSender(), address(this), _rollHeroPrice));
        heroPrimeNFT.incrementRolls(amount, _msgSender());
    }

    //rollForHero
    function rollForHero(uint256 amount, uint elementindex) external {
        heroPrimeNFT.rollHero(amount, _msgSender(), elementindex);
    }

    function generation() external view returns (uint256){
        
    }

    // attackFee
    // enterDungeonFee

    // BuyHeroPrime

    // marketplace functions
    function placeItemForSale(uint256 _tokenId, uint256 _price) external {
        require(heroPrimeNFT.ownerOf(_tokenId) == _msgSender(), "not Owner");
        heroPrimeNFT.placeOrder(_tokenId, _price, _msgSender());
    }
    function removeItemFromSale(uint256 _tokenId) external {
        heroPrimeNFT.cancelOrder(_tokenId, _msgSender());
    }
    function buyItemFromMarketplace(uint256 _tokenId) external {
        heroPrimeNFT.fillOrder(_tokenId, _msgSender());
    }
}