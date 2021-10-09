const _ = require('underscore');

const Web3 = require('web3')
const nftArtifact = require('./../../build/contracts/HeroPrimeNFT.json');
const Provider = require("@truffle/hdwallet-provider");

const networkUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const ownerAddress = "0x79cf51B5253991f8FAD399958AE8DAeF31de358E";
const ownerPrivateAddress = "08fe8f7e35072c7af83bbd2d37e6653f4fc43a7627dc06c294ed097ad841dc52";

async function getHeroes(address){
    return new Promise(async resolve => {
        const provider = new Provider(ownerPrivateAddress, networkUrl);
        const web3 = new Web3(provider);
        let networkId = await web3.eth.net.getId();

        const abi = nftArtifact.abi;
        const networkAddress = nftArtifact.networks[networkId].address;
        const nftContract = await new web3.eth.Contract(abi, networkAddress);


        nftContract.methods.getOwnerTokens(address)
            .call()
            .then(value => {
            let myHeroesIndexes = value;
            nftContract.methods.getHeroPrimes(myHeroesIndexes)
            .call()
            .then(value => {
                
                resolve(castHeroes(value));
            });
        });
    });
}
function castHeroes(array){
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
exports.getHeroes = getHeroes;