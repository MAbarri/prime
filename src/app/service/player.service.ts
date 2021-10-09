import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// const apiBaseUrl = "/api/";
const apiBaseUrl = "/api/players/";

@Injectable({
  providedIn: "root"
})
export class PlayerService {
  constructor(private httpClient: HttpClient) { }

  getmyStats(): Observable<any> {
    return this.httpClient.get(apiBaseUrl+"myStats" );
  }

  findByAddress(address: any): Observable<any> {
    return this.httpClient.get(apiBaseUrl+"byAddress/" + address);
  }

  claimTokens(address: string): Observable<any> {
    return this.httpClient.get(apiBaseUrl+ "claimTokens/:" + address);
  }

}
