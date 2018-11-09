import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CapasService {

    public url: string;
 
    constructor(
        public http: HttpClient
    ){
        this.url = 'https://gis-entorno-benjamin-s-e.c9users.io:8080/capas';
    }

    obtener(): Observable<any>{
        return this.http.get(this.url, { observe: 'response' });
    }

    traer(nombre): Observable<any>{

        return this.http.get(this.url+"/nombre/"+nombre, { observe: 'response' });
    }

    importar(contenido): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');         
        return this.http.post(this.url+'/importar', contenido, {headers: headers, observe: 'response'});
    }

    agregar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.post(this.url, capa, {headers: headers,  observe: 'response'});
    }   

    crearAtributos(atributos): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.post('https://gis-entorno-benjamin-s-e.c9users.io:8080/atributos', atributos, {headers: headers,  observe: 'response'});
    }   

    eliminarAtributos(id): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json');
        return this.http.delete('https://gis-entorno-benjamin-s-e.c9users.io:8080/atributos/'+id, {headers: headers,  observe: 'response'});
    }   


    actualizar(capa): Observable<any>{

        capa.categoria = capa.categoria.id;

        let headers = new HttpHeaders().set('Content-Type','application/json');         
        return this.http.put(this.url+'/'+capa.id, capa, {headers: headers, observe: 'response'});
    }

    eliminar(capa): Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.delete(this.url+'/'+capa.id, {headers: headers, observe: 'response'});
    }

    editarDatos(capa): Observable<any>{

        console.log({data: JSON.stringify(capa.geojson)});
        let headers = new HttpHeaders().set('Content-Type','application/json');         
        return this.http.put(this.url+'/nombre/'+capa.nombre, {data: JSON.stringify(capa.geojson)}, {headers: headers, observe: 'response'});
    }

}
