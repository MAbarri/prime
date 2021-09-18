import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../service/web3.service';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {

  accountNumber: any;
  tokenBalance: any;
  
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
  
  myHeroesIndexes : any;
  myHeroes : any;

  selectedHero: any;
  
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
                    this.getHeros();
                  }
                });
              this.web3.getManagerContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.managerContract = contractRes;
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

  getHeros(){
    this.nftContract.methods.getOwnerTokens(this.accountNumber)
    .call()
    .then(value => {
      this.myHeroesIndexes = value;
      this.nftContract.methods.getHeroPrimes(this.myHeroesIndexes)
      .call()
      .then(value => {
        console.log(value)
        this.myHeroes = value;
      });
    });
  }
  attackMonster(monsterIndex) {
    this.managerContract.methods.attackMonster(this.selectedHero, monsterIndex)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
    });
  }
}
