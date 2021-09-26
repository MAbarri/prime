import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';

// const apiBaseUrl = "/api/";
const apiBaseUrl = "/api/users/";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private httpClient: HttpClient, public jwtHelper: JwtHelperService) { }

  findByAddress(address: string): Observable<any> {
    // return this.httpClient.get(apiBaseUrl);
    return this.httpClient.get(apiBaseUrl+ "byAddress/" + address);
  }

  authenticate(data: any) : Observable<any> {
      return this.httpClient.post(apiBaseUrl+"auth", data);
  }
  
  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem("credentials");
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }
}
