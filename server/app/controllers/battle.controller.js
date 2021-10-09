const _ = require('underscore');

const db = require("../models");
const Player = db.players;
const Battle = db.battles;

const web3 = require('../helpers/web3').getWeb3();
const token = require('../helpers/tokenContract');

const Monster = require('../game-settings/monsters.json');
const NORMAL_MONSTERS = Monster.arenaMonsters;
// getMonsters
exports.getMonsters = async (req, res) => {
  res.send(NORMAL_MONSTERS);
};

// getMonsters
exports.attackMonster = async (req, res) => {
  let address = req.user.payload.publicAddress;

  let hero_id = req.body.hero;
  let artifact_id = req.body.artifacts;
  let monster_id = req.body.monster;

  let target = _.find(NORMAL_MONSTERS, function(monster){
    return monster.id == monster_id;
  })

  let rand = getRandomInt(0, 100);

  let battleResult = {
    ownerAddress: address.toLowerCase(),
    heroes: [hero_id],
    items: [artifact_id],
    target: [monster_id]
  }
  if(rand<=target.scale) {
    battleResult.result = 'WIN';
    battleResult.reward = target.reward;
  } else 
    battleResult.result = 'LOSS';

  const finalBattle = new Battle(battleResult);

  // Save Player in the database
  finalBattle
    .save(finalBattle)
    .then(data => {

      Player.findOneAndUpdate({address: address.toLowerCase()}, { $inc: { claimableToken: target.reward }})
      .then(data => {
        res.send(finalBattle);
      })

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player."
      });
    });
};
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}