import { Component, OnInit } from '@angular/core';
import {Web3Service} from '../service/web3.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit {

  accountNumber: any;
  tokenBalance: any;

  nftApproved = false;
  nftApprovedonToken = false;

  rollsBalance: any;
  rollsamount: any;
  private managerContract : any;
  private tokenContract : any;
  private nftContract : any;
  manager_address : any;
  nft_address : any;

  myHeroesIndexes : any;
  myHeroes : any;

  sellPrice = {};
  itemsForSale : any;
  itemsPrice : any;
  marketLength = 0;
  
  
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
                  this.web3.getNFTContract()
                    .then((contractRes: any) => {
                      if (contractRes) {
                        this.nftContract = contractRes;
                        this.nft_address = this.nftContract._address;
                      }
                      this.web3.getManagerContract()
                        .then((contractRes: any) => {
                          if (contractRes) {
                            this.managerContract = contractRes;
                            this.manager_address = contractRes._address;
                            this.loadmarektplaceData();
                            this.checkNFTApproved();
                            this.checkNFTApprovedonToken(); 
                          }
                        });
                    });
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
  loadmarektplaceData(){
    this.getHeros();
    this.getMarketsSize()
    this.getMarket();
    this.getHeroRolls();
  }
  
  checkNFTApproved(){
    this.nftContract.methods.isApprovedForAll(this.accountNumber, this.manager_address)
    .call()
    .then(value => {
      console.log('approved :', value)
      this.nftApproved = value;
    });
  }
  checkNFTApprovedonToken(){
    this.tokenContract.methods.allowance(this.accountNumber, this.nft_address)
    .call()
    .then(value => {
      console.log('approved :', value)
      this.nftApprovedonToken = value > 0;
    });
  }
  approveNFTmarketplace(){
    
    this.nftContract.methods.setApprovalForAll(this.manager_address, true)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.checkNFTApproved()
    });
  }
  approveNFTmarketplaceToken(){
    
    this.tokenContract.methods.approve(this.nft_address, "1000000000000000000000000")
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('approved')
      this.checkNFTApprovedonToken();
    });
  }
  getHeroRolls(){
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
        console.log(value)
        this.myHeroes = value;
      });
    });
  }
  getMarketsSize() {
    this.nftContract.methods.marketsSize()
    .call()
    .then(value => {
      this.marketLength = value;
    });
  }
  getMarket() {
    this.nftContract.methods.market()
    .call()
    .then(value => {
      let itemsForSale = value.resultHeroes;
      let itemsPrice = value.resultSales;
      let tempraryPrices = {};
      _.each(itemsPrice, function(priceItem){
        tempraryPrices[priceItem.tokenId] = {price: priceItem.price, owner: priceItem.owner};
      })
      this.itemsForSale = _.map(itemsForSale, function(item){
        let returnItem = {
          id: item.id,
          dna: item.dna,
          element: item.element,
          exp: item.exp,
          price: tempraryPrices[item.id].price,
          owner: tempraryPrices[item.id].owner
        }
        return returnItem;
      })
    });
  }
  placeOrder(tokenid) {
    let price = this.calculatePrice(this.sellPrice[tokenid]);
    this.managerContract.methods.placeItemForSale(tokenid, price)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.loadmarektplaceData();
    });
  }

  cancelOrder(tokenid){
    this.managerContract.methods.removeItemFromSale(tokenid)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.loadmarektplaceData();
    });
  }
  
  fillOrder(tokenid){
    this.managerContract.methods.buyItemFromMarketplace(tokenid)
    .send({from: this.accountNumber})
    .once('receipt', (receipt) => {
      console.log('receipt', receipt)
      this.loadmarektplaceData();
    });
  }
  calculatePrice(price){
    return String((parseInt(price) * 10**18));
  }
}
