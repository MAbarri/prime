import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

// const apiBaseUrl = "/api/";
const apiBaseUrl = "/api/battle/";

@Injectable({
  providedIn: "root"
})
export class BattleService {
  constructor(private httpClient: HttpClient) { }

  getHeros(): Observable<any> {
    return this.httpClient.get(apiBaseUrl+"heroes");
  }

  getArtifacts(): Observable<any> {
    return this.httpClient.get(apiBaseUrl+"artifacts");
  }

  getMonsters(): Observable<any> {
    return this.httpClient.get(apiBaseUrl+"monsters");
  }

  attackMonster(heroid, artifact, monsterid): Observable<any> {
    return this.httpClient.post(apiBaseUrl+"attackMonster", {hero: heroid, monster: monsterid, artifacts: artifact});
  }

}
