import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../service/web3.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  accountNumber: any;
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
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
                  }
                });
              this.web3.getManagerContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.managerContract = contractRes;
                    this.manager_address = contractRes._address;
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
  setManagerInNFT(){
    this.nftContract.methods.setManager(this.manager_address)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
    });
  }

}
