import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
    public url: string;
  
  constructor(public http: HttpClient) {
        this.url = 'http://190.168.131.13:8000/auth/';
   }

   login(user): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json');
        return this.http.post(this.url+"login/", user, {headers: headers,  observe: 'response'});
    }

    register(user): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json');
        return this.http.post(this.url+"registration/", user, {headers: headers,  observe: 'response'});
    }

    info(header): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', header);
        return this.http.get(this.url+"user/", {headers: headers,  observe: 'response'});
    }

    update(header, user): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', header);
        return this.http.put(this.url+"user/", user, {headers: headers,  observe: 'response'});
    }



}
