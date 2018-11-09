"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/common/http');
var CategoriasService = (function () {
    function CategoriasService(http) {
        this.http = http;
        this.url = 'https://gis-entorno-benjamin-s-e.c9users.io:8080/categorias';
    }
    CategoriasService.prototype.obtener = function () {
        return this.http.get(this.url, { observe: 'response' });
    };
    CategoriasService.prototype.agregar = function (categoria) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        var hola = this.http.post(this.url, categoria, { headers: headers, observe: 'response' });
        console.log(hola);
        return hola;
    };
    CategoriasService.prototype.actualizar = function (categoria) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.put(this.url + '/' + categoria.id, categoria, { headers: headers, observe: 'response' });
    };
    CategoriasService.prototype.eliminar = function (categoria) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.delete(this.url + '/' + categoria.id, { headers: headers, observe: 'response' });
    };
    CategoriasService.prototype.crearParametros = function (parametros) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post('https://gis-entorno-benjamin-s-e.c9users.io:8080/parametros', parametros, { headers: headers, observe: 'response' });
    };
    CategoriasService.prototype.eliminarParametros = function (id) {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        return this.http.delete('https://gis-entorno-benjamin-s-e.c9users.io:8080/parametros/' + id, { headers: headers, observe: 'response' });
    };
    CategoriasService = __decorate([
        core_1.Injectable()
    ], CategoriasService);
    return CategoriasService;
}());
exports.CategoriasService = CategoriasService;
