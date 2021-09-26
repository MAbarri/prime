const db = require("../models");
const User = db.users;
const ethUtil = require("ethereumjs-util");
const jwt = require("jsonwebtoken");

const config = require("../config/app.config.js");


// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.address) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a User
  const user = new User({
    address: req.body.address,
    claimableToken: req.body.claimableToken,
    claimableExp: req.body.claimableExp
  });

  // Save User in the database
  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const address = req.query.address;
  var condition = address ? { address: { $regex: new RegExp(address), $options: "i" } } : {};

  User.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findByAddress = (req, res) => {
  console.log('findByAddress :', req.params.address)
  const address = req.params.address;

  User.findOne({publicAddress: address})
    .then(data => {
      if (!data) {

        // Create a User
        const user = new User({
          publicAddress: address,
        });

        // Save User in the database
        user
          .save(user)
          .then(data => {
            res.send(data);
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

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`
        });
      } else res.send({ message: "User was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      } else {
        res.send({
          message: "User was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Users were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
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
              console.log('address 1:', address)
              console.log('address 2:', publicAddress)

            if (address.toLowerCase() === publicAddress.toLowerCase()) {
              console.log('success ---------------------')
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

