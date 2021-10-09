import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  heroRollsBalance: any;
  artifactRollsBalance: any;
  
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
  private artifactnftContract : any;
  manager_address : any;

  myHeroesIndexes : any;
  myArtifactsIndexes : any;
  myHeroes : any;
  myArtifacts : any;

  player: any;

  constructor(private cdr: ChangeDetectorRef, private web3: Web3Service, private playerService : PlayerService) {
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
                    this.getHeroRolls();
                  }
                });
              this.web3.getArtifactNFTContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.artifactnftContract = contractRes;
                    this.getArtifacts();
                    this.getArtifactRolls();
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
  getclaimableTokens(){
    this.managerContract.methods.readClaimableTokens(this.accountNumber)
    .call()
    .then(value => {
      console.log('_________ my flouss', value)
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
  getArtifacts(){
    this.artifactnftContract.methods.getOwnerTokens(this.accountNumber)
    .call()
    .then(value => {
      this.myArtifactsIndexes = value;
      this.artifactnftContract.methods.getArtifacts(this.myArtifactsIndexes)
      .call()
      .then(value => {
        console.log("this.myArtifacts", value)
        this.myArtifacts = value;
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

  rollForHero(){
    this.managerContract.methods.rollForHero(1, 1)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.getHeros()
      this.getHeroRolls()
    });
  }

  rollForArtifact(){
    this.managerContract.methods.rollForArtifact(1, 1)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.getArtifacts()
      this.getArtifactRolls()
    });
  }

  getPlayerDetails(){
    this.playerService.getmyStats().subscribe((response) =>{
    this.player = response;
      this.cdr.detectChanges();
      console.log('this.player', this.player)
    })
  }

  claimTokens(){
    this.managerContract.methods.claimRewards("0xa6B3C61fAeB749169FAF6B06D49E151969B508a1","209e4e4ede6f4b0faa41c3f44d176e70")
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
    });
  }

  executeClaimTokens(){
    this.managerContract.methods.executeClaimTokens()
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
    });
  }

}
