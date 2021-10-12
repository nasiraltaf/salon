import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class ApiService {
  baseUrl: any = environment.baseUrl;
  category: any;
  userToken: any;
  deviceToken: any;
  verifyMo: any;
  phone_no: any;
  id: any;
  bookid: any;
  time: any = {};
  constructor(private http: HttpClient) {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    }
  }
  getData(url) {
    return this.http.get(this.baseUrl + url);
  }
  postData(url, data) {
    console.log("jjj");
    return this.http.post(this.baseUrl + url, data);
  }

  getDataWithToken(url) {
    let header = new HttpHeaders();
    header = header.set("Authorization", "Bearer " + this.userToken);
    header = header.set("Accept", "application/json");
    return this.http.get(this.baseUrl + url, { headers: header });
  }

  postDataWithToken(url, data) {
    let header = new HttpHeaders();
    header = header.set("Authorization", "Bearer " + this.userToken);
    header = header.set("Accept", "application/json");
    return this.http.post(this.baseUrl + url, data, { headers: header });
  }
}
