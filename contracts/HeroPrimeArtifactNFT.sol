// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./IHeroPrimeManager.sol";
import "./IERC20.sol";
import "./ERC721.sol";

contract HeroPrimeArtifactNFT is ERC721, Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    
    enum Effect {
        BOOSTA,
        BOOSTB,
        BOOSTC,
        BOOSTD,
        BOOSTE,
        BOOSTF,
        BOOSTJ
    }
    
    event rolledHero(uint256 indexed tokenId, address buyer);
    event Exp(uint256 indexed tokenId, uint256 exp);
    
    event PlaceOrder(uint256 indexed tokenId, address seller, uint256 price);
    event CancelOrder(uint256 indexed tokenId, address seller);
    event FillOrder(uint256 indexed tokenId, address seller);

    struct Artifact {
        uint id;
        uint256 generation;
        Effect element;
        uint256 exp;
        uint256 dna;
        uint256 farmTime;
        uint256 bornTime;
    }
    struct ItemSale {
        uint256 tokenId;
        address owner;
        uint256 price;
    }
    
    uint256 public latestTokenId;

    mapping(uint256 => Artifact) internal heroPrimesArtifact;
    mapping(uint256 => ItemSale) internal listings;
    
    EnumerableSet.UintSet private tokenSales;
    mapping(address => EnumerableSet.UintSet) private sellerTokens;

    mapping(address => uint256) internal heroPrimeArtifactRolls;

    
    IERC20 public heroPrimeERC20;
    IHeroPrimeManager public manager;

    constructor(
        string memory _name,
        string memory _symbol,
        address _heroprimeERC20
    ) ERC721(_name, _symbol) {
        heroPrimeERC20 = IERC20(_heroprimeERC20);
    }

    function setManager(address _manager) external onlyOwner{
        manager = IHeroPrimeManager(_manager);
    }
    modifier onlyManager(){
        require(_msgSender() == address(manager), "Not Allowed");
        _;
    }
    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);

        _incrementTokenId();
    }
    
    /**
     * @dev calculates the next token ID based on value of latestTokenId
     * @return uint256 for the next token ID
     */
    function _getNextTokenId() private view returns (uint256) {
        return latestTokenId.add(1);
    }

    /**
     * @dev increments the value of latestTokenId
     */
    function _incrementTokenId() private {
        latestTokenId++;
    }

    function getArtifact(uint256 _tokenId)
        public
        view
        returns (Artifact memory)
    {
        return heroPrimesArtifact[_tokenId];
    }

    function getArtifacts(uint256[] memory _tokenIds)
        public
        view
        returns (Artifact[] memory)
    {
        Artifact[] memory result = new Artifact[](_tokenIds.length);
        for (uint256 index = 0; index < _tokenIds.length; index++) {
            result[index] = heroPrimesArtifact[_tokenIds[index]];
        }
        return result;
    }

    
    function getRare(uint256 _tokenId) public view returns (uint256) {
        uint256 dna = getArtifact(_tokenId).dna;
        if (dna == 0) return 0;
        uint256 rareParser = dna / 10**26;
        if (rareParser < 5225) {
            return 1;
        } else if (rareParser < 7837) {
            return 2;
        } else if (rareParser < 8707) {
            return 3;
        } else if (rareParser < 9360) {
            return 4;
        } else if (rareParser < 9708) {
            return 5;
        } else {
            return 6;
        }
    }


    function rollArtifact(
        uint256 amount,
        address receiver,
        uint elementindex
    ) external {
        require(heroPrimeArtifactRolls[receiver] >= amount, "not Enough Rolls" );
        Effect element = Effect(elementindex);
        require(amount > 0, "require: >0");
        if (amount == 1) _rollArtifact(receiver, element);
        else
            for (uint256 index = 0; index < amount; index++) {
                _rollArtifact(receiver, element);
            }
    }

    function _rollArtifact(address receiver, Effect element) internal {
        heroPrimeArtifactRolls[receiver] = heroPrimeArtifactRolls[receiver].sub(1);
        uint256 nextTokenId = _getNextTokenId();
        _mint(receiver, nextTokenId);
        uint rarity = generation("rarity", nextTokenId);
        heroPrimesArtifact[nextTokenId] = Artifact({
            id: nextTokenId,
            generation: rarity,
            element: element,
            exp: 0,
            dna: 0,
            farmTime: 0,
            bornTime: block.timestamp
        });

        emit rolledHero(nextTokenId, receiver);
    }

    function incrementRolls(uint256 amount, address receiver) external {
        require(amount > 0, "require: >0");
        if (amount == 1) _incrementRolls(receiver);
        else
            for (uint256 index = 0; index < amount; index++) {
                _incrementRolls(receiver);
            }
    }

    function _incrementRolls(address receiver) internal {
        heroPrimeArtifactRolls[receiver] = heroPrimeArtifactRolls[receiver].add(1);
    }

    function getOwnerArtifactRolls(address owner) external view returns (uint256) {
        return heroPrimeArtifactRolls[owner];
    }
    
    function exp(uint256 _tokenId, uint256 _exp) public {
        require(_exp > 0, "no exp");
        Artifact storage heroPrime = heroPrimesArtifact[_tokenId];
        heroPrime.exp = heroPrime.exp.add(_exp);
        emit Exp(_tokenId, _exp);
    }

    

    function generation(string memory field, uint id) internal view returns (uint256){
        uint result;
        if(keccak256(bytes(field)) == keccak256(bytes("rarity"))) {
            uint rand = random(id, 2);
            if(rand < 5) {
                result = 1;
            } else if (rand < 15) {
                result = 2;
            } else if (rand < 35) {
                result = 3;
            } else if (rand < 65) {
                result = 4;
            } else {
                result = 5;
            }
        } else if(keccak256(bytes(field)) == keccak256(bytes("element"))) {
            uint rand = random(id, 2);
            result = rand.div(20);
        }
        return result;
    }
  function random(uint256 _id, uint256 _length)
        private
        view
        returns (uint256)
    {
        return
            uint256(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            block.difficulty,
                            block.timestamp,
                            _id,
                            _length
                        )
                    )
                )
            ) % (10**_length);
    }



    // marketplace

    function placeOrder(uint256 _tokenId, uint256 _price, address sender) external onlyManager {
        require(ownerOf(_tokenId) == sender, "not own");
        require(_price > 0, "nothing is free");

        tokenOrder(_tokenId, true, _price, sender);

        emit PlaceOrder(_tokenId, sender, _price);
    }

    function cancelOrder(uint256 _tokenId, address sender) external onlyManager {
        require(tokenSales.contains(_tokenId), "not sale");
        ItemSale storage itemSale = listings[_tokenId];
        require(itemSale.owner == sender, "not own");

        tokenOrder(_tokenId, false, 0, sender);

        emit CancelOrder(_tokenId, sender);
    }

    function fillOrder(uint256 _tokenId, address sender) external onlyManager {
        require(tokenSales.contains(_tokenId), "not sale");
        ItemSale storage itemSale = listings[_tokenId];
        uint256 feeMarket = itemSale.price.mul(manager.feeMarketRate()).div(
            manager.divPercent()
        );
        heroPrimeERC20.transferFrom(sender, manager.feeAddress(), feeMarket);
        heroPrimeERC20.transferFrom(
            sender,
            itemSale.owner,
            itemSale.price.sub(feeMarket)
        );

        tokenOrder(_tokenId, false, 0, sender);
        emit FillOrder(_tokenId, sender);
    }

    function tokenOrder(
        uint256 _tokenId,
        bool _sell,
        uint256 _price,
        address sender
    ) internal {
        ItemSale storage itemSale = listings[_tokenId];
        if (_sell) {
            transferFrom(sender, manager.feeAddress(), _tokenId);
            tokenSales.add(_tokenId);
            sellerTokens[sender].add(_tokenId);

            listings[_tokenId] = ItemSale({
                tokenId: _tokenId,
                price: _price,
                owner: sender
            });
        } else {
            transferFrom(manager.feeAddress(), sender, _tokenId);

            tokenSales.remove(_tokenId);
            sellerTokens[itemSale.owner].remove(_tokenId);
            listings[_tokenId] = ItemSale({
                tokenId: 0,
                price: 0,
                owner: address(0)
            });
        }
    }

    function marketsSize() public view returns (uint256) {
        return tokenSales.length();
    }
    function market() public view returns (Artifact[] memory resultHeroes, ItemSale[] memory resultSales ) {
        resultHeroes = new Artifact[](tokenSales.length());
        resultSales = new ItemSale[](tokenSales.length());
        for (uint256 index = 0; index < tokenSales.length(); index++) {
            resultHeroes[index] = heroPrimesArtifact[tokenSales.at(index)];
            resultSales[index] = listings[heroPrimesArtifact[tokenSales.at(index)].id];
        }
    }

    function orders(address _seller) public view returns (uint256) {
        return sellerTokens[_seller].length();
    }

    function tokenSaleByIndex(uint256 index) public view returns (uint256) {
        return tokenSales.at(index);
    }

    function tokenSaleOfOwnerByIndex(address _seller, uint256 index)
        public
        view
        returns (uint256)
    {
        return sellerTokens[_seller].at(index);
    }

    function getSale(uint256 _tokenId) public view returns (ItemSale memory) {
        if (tokenSales.contains(_tokenId)) return listings[_tokenId];
        return ItemSale({tokenId: 0, owner: address(0), price: 0});
    }
}