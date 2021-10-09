// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./IHeroPrimeNFT.sol";
import "./IHeroPrimeArtifactNFT.sol";
import "./IERC20.sol";
import "./IHeroPrimeEngine.sol";

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract HeroPrimeManager is Context, Ownable, ChainlinkClient {
  using Chainlink for Chainlink.Request;
    using SafeMath for uint256;

    string private URL = "https://fluffy-hound-39.loca.lt/api/players/claimTokens/";
    // address public oracleid = 0xa6B3C61fAeB749169FAF6B06D49E151969B508a1;
    // string public jobid = "209e4e4ede6f4b0faa41c3f44d176e70";
    mapping (bytes32 => address) public requestMapping;


    uint public _rollHeroPrice = 200 * 10**18;
    uint public _rollArtifactPrice = 200 * 10**18;
    uint public _attackFee = 1 * 10**18;
    uint public feeMarketRate = 1;
    uint public divPercent = 10;


    uint256 constant private ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;

    IHeroPrimeNFT internal heroPrimeNFT;
    IHeroPrimeArtifactNFT internal heroPrimeArtifactNFT;
    IERC20 internal heroPrimeToken;
    IHeroPrimeEngine internal heroPrimeEngine;

    address public feeAddress;

    mapping(address => uint256) internal claimableTokens;


    constructor(address token, address nft, address artifactnft, address engine){
        setChainlinkToken(0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06);
        heroPrimeNFT = IHeroPrimeNFT(nft);
        heroPrimeArtifactNFT = IHeroPrimeArtifactNFT(artifactnft);
        heroPrimeToken = IERC20(token);
        heroPrimeEngine = IHeroPrimeEngine(engine);
        feeAddress = address(this);
    }

    function setClaimURL(string memory _url) external onlyOwner{
        URL = _url;
    }

    function setAttackFee(uint _fee) external onlyOwner{
        _attackFee = _fee;
    }

    function setRollHeroPrice(uint _fee) external onlyOwner{
        _rollHeroPrice = _fee;
    }

    function setRollArtifactPrice(uint _fee) external onlyOwner{
        _rollArtifactPrice = _fee;
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
    
    // rollHeroPrice
    function buyArtifactRolls(uint amount) external {
        require(heroPrimeToken.transferFrom(_msgSender(), address(this), _rollArtifactPrice));
        heroPrimeArtifactNFT.incrementRolls(amount, _msgSender());
    }

    //rollForArtifact
    function rollForArtifact(uint256 amount, uint elementindex) external {
        heroPrimeArtifactNFT.rollArtifact(amount, _msgSender(), elementindex);
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
    // artifact marketplace
    function placeItemForSaleArtifact(uint256 _tokenId, uint256 _price) external {
        require(heroPrimeArtifactNFT.ownerOf(_tokenId) == _msgSender(), "not Owner");
        heroPrimeArtifactNFT.placeOrder(_tokenId, _price, _msgSender());
    }
    function removeItemFromSaleArtifact(uint256 _tokenId) external {
        heroPrimeArtifactNFT.cancelOrder(_tokenId, _msgSender());
    }
    function buyItemFromMarketplaceArtifact(uint256 _tokenId) external {
        heroPrimeArtifactNFT.fillOrder(_tokenId, _msgSender());
    }

    // Claim Token Reward

    function claimRewards(address _oracle, string memory _jobId) external {
        requestRedeemableTokens(_oracle, _jobId);
    }

  
  function requestRedeemableTokens(address _oracle, string memory _jobId)
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillRedeemableTokens.selector);
    string memory requestUrl = string(abi.encodePacked(URL, toAsciiString(msg.sender)));
    req.add("get", requestUrl);
    req.add("path", "tokens");
    bytes32 requestId = sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    
    requestMapping[requestId] = msg.sender;
  }


  function fulfillRedeemableTokens(bytes32 _requestId, uint _tokens)
    public
    recordChainlinkFulfillment(_requestId)
  {
    address _targetaddress = requestMapping[_requestId];
    uint tokens = _tokens;
    claimableTokens[_targetaddress] = tokens;

  }

  function executeClaimTokens() external {
    heroPrimeToken.transfer(msg.sender, claimableTokens[msg.sender]);
    // heroPrimeToken.transferFrom(address(this), msg.sender, claimableTokens[msg.sender]);

    claimableTokens[msg.sender] = 0;
  }

  function readClaimableTokens(address owner) public view returns(uint){
    return claimableTokens[owner];
  }

    function toAsciiString(address x) internal pure returns (string memory) {
    bytes memory s = new bytes(40);
    for (uint i = 0; i < 20; i++) {
        bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
        bytes1 hi = bytes1(uint8(b) / 16);
        bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
        s[2*i] = char(hi);
        s[2*i+1] = char(lo);            
    }
    return string(s);
    }
    
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }
  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly { // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }
}