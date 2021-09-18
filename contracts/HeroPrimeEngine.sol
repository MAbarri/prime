// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Utils.sol";
import "./IHeroPrimeNFT.sol";
import "./IHeroPrimeToken.sol";

contract HeroPrimeEngine is Context {
    using SafeMath for uint256;
    // Attack Logic
    
    enum NormalMonsterLevel {
        LEVEL_1, // 70-80%
        LEVEL_2, // 60-70%
        LEVEL_3, // 50-60%
        LEVEL_4  // 10-20%
    }
    event BattleEvent(
        uint256 indexed _tokenId,
        NormalMonsterLevel monster,
        address user,
        BattleResult result
    );
    enum BattleResult {
        LOSE,
        WIN
    }
    IHeroPrimeNFT internal heroPrimeNFT;
    IHeroPrimeToken internal heroPrimeToken;

    constructor(address token, address nft){
        heroPrimeNFT = IHeroPrimeNFT(nft);
        heroPrimeToken = IHeroPrimeToken(token);
    }
    
    function getWinRate(NormalMonsterLevel _monster) private view returns (uint256) {
        uint256 winRateRnd = random(uint256(_monster), 1);
        if (_monster == NormalMonsterLevel.LEVEL_1) {
            return winRateRnd.add(70);
        } else if (_monster == NormalMonsterLevel.LEVEL_2) {
            return winRateRnd.add(60);
        } else if (_monster == NormalMonsterLevel.LEVEL_3) {
            return winRateRnd.add(50);
        } else if (_monster == NormalMonsterLevel.LEVEL_4) {
            return winRateRnd.add(10);
        }
        return 100;
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

    function battle(address sender, uint256 _tokenId, uint _monsterLevelIndex) external returns(uint result){

        NormalMonsterLevel _monster = NormalMonsterLevel(_monsterLevelIndex);

        require(heroPrimeNFT.ownerOf(_tokenId) == sender, "not own");
        
        result = uint(BattleResult.LOSE);
        uint256 winRate = getWinRate(_monster);
        uint256 monsterLevel = uint256(_monster);
        uint256 rnd = random(_tokenId, 4).div(100);

        
        uint256 monsterRate = monsterLevel < 4
            ? monsterLevel
            : monsterLevel + 1;

            
        uint256 level = heroPrimeNFT.heroPrimeLevel(_tokenId);

        uint256 exp = monsterRate.mul(10).mul(level).mul(uint256(100).sub(winRate));

        if (rnd < winRate) {
            result = uint(BattleResult.WIN);
            // uint256 reward = battleReward(level, winRate);
            // zoonerToken.win(_msgSender(), reward);
            // console.log("reward: %s", reward);
        } else {
            // exp = exp.mul(manager.loseRate()).div(100);
        }
        
        heroPrimeNFT.exp(_tokenId, exp);
        
        emit BattleEvent(_tokenId, _monster, _msgSender(), BattleResult(result));
    }
    
    // Dungeon Logic
}
