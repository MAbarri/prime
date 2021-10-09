const HeroPrimeToken = artifacts.require("HeroPrimeToken");
const ArtifactNFT = artifacts.require("HeroPrimeArtifactNFT");


module.exports = function(deployer) {
    return deployer.deploy(ArtifactNFT, "Hero Prime Artifact NFT", "HPANFT", HeroPrimeToken.address);
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

