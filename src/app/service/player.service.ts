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

  findAll(): Observable<any> {
    return this.httpClient.get(apiBaseUrl);
  }

  findOne(id: number): Observable<any> {
    return this.httpClient.get(apiBaseUrl + id);
  }

  findByAddress(address: any): Observable<any> {
    return this.httpClient.get(apiBaseUrl+"byAddress/" + address);
  }

  claimTokens(address: string): Observable<any> {
    return this.httpClient.get(apiBaseUrl+ "claimTokens/:" + address);
  }

  edit(data: any): Observable<any> {
    return this.httpClient.put(apiBaseUrl + data._id, data);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(apiBaseUrl, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(apiBaseUrl + id);
  }

  authenticate(data: any) : Observable<any> {
      return this.httpClient.post(apiBaseUrl+"auth", data);
  }
}
