module.exports = app => {
    const battles = require("../controllers/battle.controller.js");
    const players = require("../controllers/player.controller.js");
    const auth = require("../middleware/auth");
  
    var router = require("express").Router();
  
    // Get My Heroes
    router.get("/heroes", auth, players.getHeroes);
  
    // Get My Artifacts
    router.get("/artifacts", auth, players.getArtifacts);

    // Get monsters
    router.get("/monsters", auth, battles.getMonsters);

    // attack Monster
    router.post("/attackMonster", auth, battles.attackMonster);
  
    app.use("/api/battle", router);
  };
  