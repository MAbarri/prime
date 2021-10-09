module.exports = app => {
    const players = require("../controllers/player.controller.js");
    const auth = require("../middleware/auth");
  
    var router = require("express").Router();
    
    // Create a new Tutorial
    router.get("/myStats", auth, players.getMyStats);
    
    // Create a new Tutorial
    router.get("/byAddress/:address", auth, players.getByAddress);
  
    // Create a new Tutorial
    router.get("/claimTokens/:address", players.claimTokens);
  
    app.use("/api/players", router);
  };
  