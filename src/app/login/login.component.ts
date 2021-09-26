import { Component, OnInit } from '@angular/core';
import { AuthService} from "../service/auth.service";
import { Web3Service } from '../service/web3.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  accountNumber: any;
  userAccount : any;

  constructor(private web3: Web3Service, private userService : AuthService, private router: Router) {
    
    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.accountNumber = accountData[0];
              // Check If Connected redirect to arena
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

  signIn() {
    console.log('this.accountNumber', this.accountNumber)
    this.getAccount(this.accountNumber);
  }

	private getAccount(address): void {
		this.userService.findByAddress(address).subscribe(response => {
			this.userAccount = response;
      this.handleSignMessage({publicAddress: this.userAccount.publicAddress, nonce: this.userAccount.nonce});
		});
	}
  private handleSignMessage({ publicAddress, nonce }) {
    this.web3.signNounce(publicAddress, nonce).then((signedData) => {
      this.userService.authenticate({address: signedData.address, signature: signedData.signature}).subscribe(response => {
        sessionStorage.setItem("credentials", response.token);
        this.router.navigate(['/inventory'])
        .then(() => {
          window.location.reload();
        });
      });
    })
  }
  
}
