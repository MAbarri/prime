const Web3 = require('web3')

function web3(){
    const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'))
    return web3;
}

exports.getWeb3 = web3;

