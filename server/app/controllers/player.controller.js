const db = require("../models");
const Player = db.players;

const web3 = require('../helpers/web3').getWeb3();
const token = require('../helpers/tokenContract');
const nft = require('../helpers/nftContract');
const artifactNft = require('../helpers/artifactNftContract');

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
exports.getMyStats = (req, res) => {
  let address = req.user.payload.publicAddress;

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

// FclaimTokens Players
exports.claimTokens = async (req, res) => {
  let address = "0x"+req.params.address.toLowerCase();
  console.log('address', address)
  Player.findOne({ address: address })
    .then(async player => {
      await Player.findByIdAndUpdate(player._id, {$set: {claimableToken: 0}});
      let data = {
        "tokens": player.claimableToken,
        "address": player.address
      }
      res.send(data);
    })
    .catch(err => {
      console.log('err', err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};

// getHeroes
exports.getHeroes = async (req, res) => {
  let address = req.user.payload.publicAddress;
  console.log('address', address)

    nft.getHeroes(address).then(heroes => {
      res.send(heroes);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};

// getArtifacts
exports.getArtifacts = async (req, res) => {
  let address = req.user.payload.publicAddress;
  console.log('address', address)

  artifactNft.getArtifacts(address).then(heroes => {
      res.send(heroes);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving players."
      });
    });
};
