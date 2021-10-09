import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../service/web3.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  accountNumber: any;
  tokenBalance: any;

  managerApproved = false;
  heroRollsBalance: any;
  artifactRollsBalance: any;
  rollsamount: any;
  artifactrollsamount: any;
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
  private artifactnftContract : any;
  manager_address : any;

  
  constructor(private web3: Web3Service) {
    
    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.accountNumber = accountData[0];

              this.web3.getTokenContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.tokenContract = contractRes;
                  }
                });
              this.web3.getNFTContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.nftContract = contractRes;
                    this.getHeroRolls();
                  }
                });
              this.web3.getArtifactNFTContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.artifactnftContract = contractRes;
                    this.getArtifactRolls();
                  }
                });
              this.web3.getManagerContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.managerContract = contractRes;
                    this.manager_address = contractRes._address;
                    this.checkApproved();
                    // this.managerContract.methods.balanceOf(this.accountNumber)
                    // .call()
                    // .then(value => {
                    //   this.tokenBalance = value;
                    // });
                  }
                });
              }, err => {
                console.log('account error', err);
              });
        }
      }, err => {
        alert(err);
      });
   }

  ngOnInit(): void {
  }
  getHeroRolls(){
    this.nftContract.methods.getOwnerHeroPrimeRolls(this.accountNumber)
    .call()
    .then(value => {
      this.heroRollsBalance = value;
    });
  }

  getArtifactRolls(){
    this.artifactnftContract.methods.getOwnerArtifactRolls(this.accountNumber)
    .call()
    .then(value => {
      this.artifactRollsBalance = value;
    });
  }
  checkApproved(){
    this.tokenContract.methods.allowance(this.accountNumber, this.manager_address)
    .call()
    .then(value => {
      console.log('approved :', value)
      this.managerApproved = value > 0;
    });
  }
  approveManager(){
    this.tokenContract.methods.approve(this.manager_address, "1000000000000000000000000")
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('approved')
      this.checkApproved();
    });
  }
  buyHeroRolls(){
    this.managerContract.methods.buyHeroRolls(this.rollsamount)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.getHeroRolls();
    });
  }
  buyArtifactRolls(){
    this.managerContract.methods.buyArtifactRolls(this.artifactrollsamount)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.getArtifactRolls();
    });
  }
}
