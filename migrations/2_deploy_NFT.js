const HeroPrimeToken = artifacts.require("HeroPrimeToken");
const NFT = artifacts.require("HeroPrimeNFT");

module.exports = function(deployer) {
  deployer.deploy(HeroPrimeToken, "Hero Prime Token", "HPT").then(function() {
    return deployer.deploy(NFT, "Hero Prime NFT", "HPNFT", HeroPrimeToken.address)
  });
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

