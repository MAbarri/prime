const HeroPrimeToken = artifacts.require("HeroPrimeToken");
const NFT = artifacts.require("HeroPrimeNFT");
const ArtifactNFT = artifacts.require("HeroPrimeArtifactNFT");
const Engine = artifacts.require("HeroPrimeEngine");
const Manager = artifacts.require("HeroPrimeManager");

module.exports = function(deployer) {
    return deployer.deploy(Manager, HeroPrimeToken.address, NFT.address, ArtifactNFT.address, Engine.address);
};

// const HeroPrimeToken = artifacts.require("HeroPrimeToken");
// const NFT = artifacts.require("HeroPrimeNFT");
// const Engine = artifacts.require("HeroPrimeEngine");

// module.exports = function(deployer) {
//   deployer.deploy(HeroPrimeToken, "Hero Prime Token", "HPT").then(function() {
//     deployer.deploy(NFT, "Hero Prime NFT", "HPNFT", HeroPrimeToken.address).then(function() {
//       return deployer.deploy(Engine, HeroPrimeToken.address, NFT.address);
//     });
//   });
// };

