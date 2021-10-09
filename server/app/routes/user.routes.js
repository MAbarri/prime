module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/auth", users.authenticate);
  
    // Retrieve a single Tutorial with id
    router.get("/byAddress/:address", users.findByAddress);
  
  
    // DEV: Clear database
    router.get("/cleardatabase", users.cleardatabase);
  
    app.use("/api/users", router);
  };
  