module.exports = app => {
    const players = require("../controllers/player.controller.js");
    const auth = require("../middleware/auth");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", players.create);
  
    // Create a new Tutorial
    router.get("/byAddress/:address", auth, players.getByAddress);
  
    // Create a new Tutorial
    router.get("/claimTokens/:address", auth, players.claimTokens);
  
    // Retrieve all players
    router.get("/", players.findAll);
  
    // Retrieve all published players
    router.get("/published", players.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", players.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", players.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", players.delete);
  
    // Create a new Tutorial
    router.delete("/", players.deleteAll);
  
    app.use("/api/players", router);
  };
  