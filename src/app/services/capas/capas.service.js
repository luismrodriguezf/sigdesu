"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/common/http');
var CapasService = (function () {
    function CapasService(http) {
        this.http = http;
        this.url = 'https://gis-entorno-benjamin-s-e.c9users.io:8080/capas';
    }
    CapasService.prototype.obtener = function () {
        return this.http.get(this.url, { observe: 'response' });
    };
    CapasService.prototype.traer = function (nombre) {
        return this.http.get(this.url + "/nombre/" + nombre, { observe: 'response' });
    };
    CapasService.prototype.importar = function (contenido) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.url + '/importar', contenido, { headers: headers, observe: 'response' });
    };
    CapasService.prototype.agregar = function (capa) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post(this.url, capa, { headers: headers, observe: 'response' });
    };
    CapasService.prototype.crearAtributos = function (atributos) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('https://gis-entorno-benjamin-s-e.c9users.io:8080/atributos', atributos, { headers: headers, observe: 'response' });
    };
    CapasService.prototype.eliminarAtributos = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete('https://gis-entorno-benjamin-s-e.c9users.io:8080/atributos/' + id, { headers: headers, observe: 'response' });
    };
    CapasService.prototype.actualizar = function (capa) {
        capa.categoria = capa.categoria.id;
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/' + capa.id, capa, { headers: headers, observe: 'response' });
    };
    CapasService.prototype.eliminar = function (capa) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.delete(this.url + '/' + capa.id, { headers: headers, observe: 'response' });
    };
    CapasService.prototype.editarDatos = function (capa) {
        console.log({ data: JSON.stringify(capa.geojson) });
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/nombre/' + capa.nombre, { data: JSON.stringify(capa.geojson) }, { headers: headers, observe: 'response' });
    };
    CapasService = __decorate([
        core_1.Injectable()
    ], CapasService);
    return CapasService;
}());
exports.CapasService = CapasService;
