const _ = require('underscore');

const db = require("../models");
const Player = db.players;
const Battle = db.battles;

const web3 = require('../helpers/web3').getWeb3();
const token = require('../helpers/tokenContract');

const Monster = require('../game-settings/monsters.json');
const NORMAL_MONSTERS = Monster.arenaMonsters;

// Create and Save a new Player
exports.create = (req, res) => {
  // Validate request
  if (!req.body.address) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Player
  const player = new Player({
    address: req.body.address,
    claimableToken: req.body.claimableToken,
    claimableExp: req.body.claimableExp
  });

  // Save Player in the database
  player
    .save(player)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player."
      });
    });
};

// Retrieve all Players from the database.
exports.findAll = (req, res) => {
  const address = req.query.address;
  var condition = address ? { address: { $regex: new RegExp(address), $options: "i" } } : {};

  Player.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};

// Find a single Player with an id
exports.getByAddress = (req, res) => {
  const address = req.params.address;

  Player.findOne({address: address})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Player with address " + address });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Player with address=" + address });
    });
};
// Find a single Player with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Player.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Player with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Player with id=" + id });
    });
};

// Update a Player by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Player.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Player with id=${id}. Maybe Player was not found!`
        });
      } else res.send({ message: "Player was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Player with id=" + id
      });
    });
};

// Delete a Player with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Player.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Player with id=${id}. Maybe Player was not found!`
        });
      } else {
        res.send({
          message: "Player was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Player with id=" + id
      });
    });
};

// Delete all Players from the database.
exports.deleteAll = (req, res) => {
  Player.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Players were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all players."
      });
    });
};

// Find all published Players
exports.findAllPublished = (req, res) => {
  Player.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};

// getMonsters
exports.getMonsters = async (req, res) => {
  res.send(NORMAL_MONSTERS);
};

// getMonsters
exports.attackMonster = async (req, res) => {
  let address = req.user.payload.publicAddress;

  let hero_id = req.body.hero;
  let monster_id = req.body.monster;

  let target = _.find(NORMAL_MONSTERS, function(monster){
    return monster.id == monster_id;
  })

  let rand = getRandomInt(0, 100);

  let battleResult = {
    ownerAddress: address,
    heroes: [hero_id],
    items: [],
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

      Player.findOneAndUpdate({address: address}, { $inc: { claimableToken: target.reward }})
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