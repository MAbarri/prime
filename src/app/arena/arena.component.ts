import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Web3Service} from '../service/web3.service';
import { BattleService} from "../service/battle.service";

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {
  loaded = false;

  accountNumber: any;
  tokenBalance: any;
  
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
  
  myArtifacts : any;
  myHeroes : any;
  monsters : any;

  selectedHero: any;
  selectedArtifact: any;

  battleResult: any;
  
  constructor(private cdr: ChangeDetectorRef, private web3: Web3Service, private battleService : BattleService) {
    
    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.accountNumber = accountData[0];

              this.getHeros();
              this.getArtifacts();
              this.getMonsters();

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
    this.battleService.getHeros().subscribe((response) => {
      this.myHeroes = response;
      this.loaded = true;
      this.cdr.detectChanges();
      console.log('myHeroes ?', this.myHeroes)
    })
  }

  getArtifacts(){
    this.battleService.getArtifacts().subscribe((response) => {
      this.myArtifacts = response;
      this.loaded = true;
      this.cdr.detectChanges();
      console.log('myHeroes ?', this.myHeroes)
    })
  }
  

  getMonsters(){
    this.battleService.getMonsters().subscribe((response) => {
      this.monsters = response;
      this.loaded = true;
      this.cdr.detectChanges();
      console.log('monsters ?', this.monsters)
    })
  }

  attackMonster(_id){
    this.battleService.attackMonster(this.selectedHero, this.selectedArtifact, _id).subscribe((response) => {
      this.battleResult = response;
    })
  }

  // attackMonster(monsterIndex) {
  //   this.managerContract.methods.attackMonster(this.selectedHero, monsterIndex)
  //   .send({from: this.accountNumber})
  //   .once('receipt', (receipt) => {
  //     console.log('receipt', receipt)
  //   });
  // }
}
