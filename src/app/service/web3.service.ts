import {Injectable} from '@angular/core';

const ManagerArtifacts = require('../../../build/contracts/HeroPrimeManager.json');
const TokenArtifacts = require('../../../build/contracts/HeroPrimeToken.json');
const NFTArtifacts = require('../../../build/contracts/HeroPrimeNFT.json');

declare var require: any;
const Web3 = require('web3');
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  fromUtf8(arg0: string): any {
    throw new Error('Method not implemented.');
  }

  private messageResult: any;
  personal: any;

  constructor() {
  }

  public checkAndInstantiateWeb3(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (window.ethereum) {
        this.messageResult = 'connected';
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        resolve(this.messageResult);
      } else if (window.web3) {
        this.messageResult = 'connected';
        window.web3 = new Web3(window.web3.currentProvider);
        resolve(this.messageResult);
      } else {
        this.messageResult = 'No Erthereum browser detected. you should consider trying MetaMask';
        reject(this.messageResult);
      }
    });
  }

  public loadBlockChainData(): Promise<string> {
    return new Promise((resolve, reject) => {
      const web3 = window.web3;
      const account = web3.eth.getAccounts();
      if (account !== undefined) {
        resolve(account);
      } else {
        this.messageResult = 'There is no account';
        reject(this.messageResult);
      }
    });
  }

  public getManagerContract() {
    return new Promise((resolve) => {
      const web3 = window.web3;
      let networkId;
      web3.eth.net.getId()
        .then((netId: any) => {
          networkId = netId;
          const abi = ManagerArtifacts.abi;
          const networkAddress = ManagerArtifacts.networks[networkId].address;
          const artifact = new web3.eth.Contract(abi, networkAddress);
          resolve(artifact);
        });
    });
  }
  public getTokenContract() {
    return new Promise((resolve) => {
      const web3 = window.web3;
      let networkId;
      web3.eth.net.getId()
        .then((netId: any) => {
          networkId = netId;
          const abi = TokenArtifacts.abi;
          const networkAddress = TokenArtifacts.networks[networkId].address;
          const artifact = new web3.eth.Contract(abi, networkAddress);
          resolve(artifact);
        });
    });
  }
  public getNFTContract() {
    return new Promise((resolve) => {
      const web3 = window.web3;
      let networkId;
      web3.eth.net.getId()
        .then((netId: any) => {
          networkId = netId;
          const abi = NFTArtifacts.abi;
          const networkAddress = NFTArtifacts.networks[networkId].address;
          const artifact = new web3.eth.Contract(abi, networkAddress);
          resolve(artifact);
        });
    });
  }

  public convertPriceToEther(price: any) {
    const web3 = window.web3;
    return web3.utils.toWei(price.toString(), 'Ether');
  }

  public convertEtherToPrice(price: any) {
    const web3 = window.web3;
    return web3.utils.fromWei(price.toString(), 'Ether');
  }

  public getEtherBalance(account: any) {

    return new Promise((resolve) => {
      const web3 = window.web3;
      const balance = web3.eth.getBalance(account)
        .then((ba: any) => {
          resolve(web3.utils.fromWei(ba, 'Ether'));
        });
    });

  }

  public signNounce(address, nonce) : any {
    const web3 = window.web3;
    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(
        web3.utils.fromUtf8("I am signing my one-time nonce:" + nonce),
        address,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ address, signature });
        }
      )
    );
  }

}
