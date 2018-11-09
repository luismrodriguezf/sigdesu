import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SucesosService {
public url: string;
public key = JSON.parse(localStorage.getItem('currentUser')).header;
  constructor(public http: HttpClient) {
      this.url = 'http://190.168.131.13:8000/sucesos';
   }

   all(): Observable<any>{
        let headers = new HttpHeaders()
                                    .set('Authorization', this.key);

        return this.http.get(this.url, {headers: headers,  observe: 'response' });
    }

    post(suceso): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', this.key);
        return this.http.post(this.url, suceso, {headers: headers,  observe: 'response'});
    }

    delete(id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Authorization', this.key);
        return this.http.delete(this.url+"/"+id , {headers: headers,  observe: 'response'});
    }

    get(id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Authorization', this.key);
        return this.http.get(this.url+"/"+id , {headers: headers,  observe: 'response'});
    }

    update(suceso, id): Observable<any>{

        let headers = new HttpHeaders()
                                    .set('Content-Type','application/json')
                                    .set('Authorization', this.key);
        return this.http.put(this.url+"/"+id, suceso, {headers: headers,  observe: 'response'});
    }

}
