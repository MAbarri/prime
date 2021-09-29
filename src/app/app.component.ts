import { Component } from '@angular/core';
import { Web3Service } from './service/web3.service';
import { AuthService } from './service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HeroPrime';

  isAlive = false;
  
  userAccount : any;

  accountNumber: any;
  tokenBalance: any;
  private tokenContract : any;

  constructor(private web3: Web3Service, private authService: AuthService, private router: Router) {
    this.isAlive = this.isAuthenticated();
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
                    
                    this.tokenContract.methods.balanceOf(this.accountNumber)
                    .call()
                    .then(value => {
                      this.tokenBalance = value;
                    });
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

   isAuthenticated(){
    return this.authService.isAuthenticated();
   }
   logOut(){
     this.authService.logOut();
     this.router.navigate(['/login'])
        .then(() => {
          window.location.reload();
        });
   }


}
