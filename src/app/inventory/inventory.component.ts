import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../service/web3.service';
import { PlayerService} from "../service/player.service";

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  accountNumber: any;
  tokenBalance: any;

  managerApproved = false;

  rollsBalance: any;
  rollsamount: any;
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
  manager_address : any;

  myHeroesIndexes : any;
  myHeroes : any;

  constructor(private web3: Web3Service, private playerService : PlayerService) {
    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.accountNumber = accountData[0];
              this.getPlayerDetails();
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
                    this.getHeros();
                    this.getRolls();
                  }
                });
              this.web3.getManagerContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.managerContract = contractRes;
                    this.manager_address = contractRes._address;
                    this.checkApproved();
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


  ngOnInit() {
  }
  getRolls(){
    this.nftContract.methods.getOwnerHeroPrimeRolls(this.accountNumber)
    .call()
    .then(value => {
      this.rollsBalance = value;
    });
  }
  getHeros(){
    this.nftContract.methods.getOwnerTokens(this.accountNumber)
    .call()
    .then(value => {
      this.myHeroesIndexes = value;
      this.nftContract.methods.getHeroPrimes(this.myHeroesIndexes)
      .call()
      .then(value => {
        console.log("this.myHeroes", value)
        this.myHeroes = value;
      });
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
  buyRolls(){

    this.managerContract.methods.buyHeroRolls(this.rollsamount)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.getRolls()
    });
  }
  rollForHero(){
    
    this.managerContract.methods.rollForHero(1, 0)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.getHeros()
      this.getRolls()
    });
  }

  getPlayerDetails(){
    this.playerService.findByAddress(this.accountNumber).subscribe(function(response){
      console.log('tokens Claimed', response)
    })
  }

  claimTokens(){
    this.playerService.claimTokens(this.accountNumber).subscribe(function(response){
      console.log('tokens Claimed', response)
    })
  }
}
