const _ = require('underscore');

const Web3 = require('web3')
const artifactNftArtifact = require('./../../build/contracts/HeroPrimeArtifactNFT.json');
const Provider = require("@truffle/hdwallet-provider");
// testnet
// const networkUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';
// dev
const networkUrl = 'HTTP://127.0.0.1:7545';
const ownerAddress = "0x79cf51B5253991f8FAD399958AE8DAeF31de358E";
const ownerPrivateAddress = "08fe8f7e35072c7af83bbd2d37e6653f4fc43a7627dc06c294ed097ad841dc52";

async function getArtifacts(address){
    return new Promise(async resolve => {
        const provider = new Provider(ownerPrivateAddress, networkUrl);
        const web3 = new Web3(provider);
        let networkId = await web3.eth.net.getId();

        const abi = artifactNftArtifact.abi;
        const networkAddress = artifactNftArtifact.networks[networkId].address;
        const nftContract = await new web3.eth.Contract(abi, networkAddress);


        nftContract.methods.getOwnerTokens(address)
            .call()
            .then(value => {
            let myArtifactsIndexes = value;
            nftContract.methods.getArtifacts(myArtifactsIndexes)
            .call()
            .then(value => {
                resolve(castArtifacts(value));
            });
        });
    });
}
function castArtifacts(array){
    let result = [];
   _.each(array, function(item){
        result.push({
            id: item["id"],
            dna: item["dna"],
            element: item["element"],
            generation: item["generation"]
        })
   })
   return result;
}
exports.getArtifacts = getArtifacts;