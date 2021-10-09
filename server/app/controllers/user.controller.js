const db = require("../models");
const User = db.users;
const Player = db.players;
const ethUtil = require("ethereumjs-util");
const jwt = require("jsonwebtoken");

const config = require("../config/app.config.js");

// Find a single User with an id
exports.findByAddress = (req, res) => {
  console.log('findByAddress :', req.params.address)
  const address = req.params.address;

  User.findOne({publicAddress: address})
    .then(data => {
      if (!data) {

        // Create a User
        const user = new User({
          publicAddress: address.toLowerCase(),
        });

        // Save User in the database
        user
          .save(user)
          .then(data => {
            
            // Create a Player
            const player = new Player({ address: address.toLowerCase() });

            // Save Player in the database
            player.save(player) .then(newPlayer => { 
              res.send(data);
             })

          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User."
            });
          });
      }
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with address=" + address });
    });
};

// Find all published Users
exports.authenticate = (req, res) => {
  console.log('________________________________________________________________________authenticate', req.body)
  const publicAddress = req.body.address;
  const signature = req.body.signature;
  User.findOne({publicAddress: publicAddress})
    .then(user => {
      if (!user) {
        res.status(404).send({});
      } else {
        console.log('user', user)
            const msgBuffer = ethUtil.toBuffer(ethUtil.fromUtf8("I am signing my one-time nonce:" + user.nonce));
            const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
            const signatureBuffer = ethUtil.toBuffer(signature);
            const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
            const publicKey = ethUtil.ecrecover(
              msgHash,
              signatureParams.v,
              signatureParams.r,
              signatureParams.s
            );
            const addressBuffer = ethUtil.publicToAddress(publicKey);
            const address = ethUtil.bufferToHex(addressBuffer);

            // The signature verification is successful if the address found with
            // ecrecover matches the initial publicAddress
              // console.log('address 1:', address)
              // console.log('address 2:', publicAddress)

            if (address.toLowerCase() === publicAddress.toLowerCase()) {
              // console.log('success ---------------------')
              let newNonce = Math.floor(Math.random() * 1000000);
              User.findByIdAndUpdate(user._id, {$set: {nonce: newNonce}}).exec(function(err, succ){
                
                const token = jwt.sign(
                  {
                    payload: {
                      id: user._id,
                      publicAddress
                    }
                  },
                  config.token_key,
                  {
                    expiresIn: "2h",
                  }
                );

                res.send({token: token});
              })
            } else {
              let newNonce = Math.floor(Math.random() * 1000000);
              User.findByIdAndUpdate(user._id, {$set: {nonce: newNonce}}).exec(function(err, succ){
                return res
                  .status(401)
                  .send({ error: 'Signature verification failed' });
              })
            }

      }
    })
    .catch(err => {
      console.log('err', err)
      res
        .status(500)
        .send({ message: "Error retrieving User with address=" + publicAddress });
    });
};

exports.cleardatabase = async (req,res) => {
  await User.deleteMany({});
  await Player.deleteMany({});
  res.send({msg: "success"});
}

