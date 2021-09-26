const Web3 = require('web3')
const tokenArtifact = require('./../../../build/contracts/HeroPrimeToken.json');
const Provider = require("@truffle/hdwallet-provider");

const networkUrl = 'HTTP://127.0.0.1:7545';
const ownerAddress = "0x79cf51B5253991f8FAD399958AE8DAeF31de358E";
const ownerPrivateAddress = "08fe8f7e35072c7af83bbd2d37e6653f4fc43a7627dc06c294ed097ad841dc52";

async function redeemToken(toAddress, amount){

    const provider = new Provider(ownerPrivateAddress, networkUrl);
    const web3 = new Web3(provider);
    let networkId = await web3.eth.net.getId();

    const abi = tokenArtifact.abi;
    const networkAddress = tokenArtifact.networks[networkId].address;
    const contract = await new web3.eth.Contract(abi, networkAddress);

    return contract.methods.transfer(toAddress, amount).send({from: ownerAddress});
}
exports.redeemToken = redeemToken;