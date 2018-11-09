"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var CrearCategoriasComponent = (function () {
    function CrearCategoriasComponent(categoriasService, flashMessage) {
        this.categoriasService = categoriasService;
        this.flashMessage = flashMessage;
        this.creacionTerminada = new core_1.EventEmitter();
    }
    CrearCategoriasComponent.prototype.ngOnInit = function () {
        this.loading = false;
        this.categoriaNueva = this.categoria;
        this.categoriaNueva.atributos = [];
        this.propiedadNueva = {
            nombre: "",
            tipo: ""
        };
    };
    CrearCategoriasComponent.prototype.agregarPropiedad = function () {
        var _this = this;
        if (this.propiedadNueva.nombre == "") {
            return false;
        }
        if (this.propiedadNueva.tipo == "") {
            return false;
        }
        if (this.categoriaNueva.atributos.find(function (element) { return element.nombre == _this.propiedadNueva.nombre; })) {
            return false;
        }
        this.categoriaNueva.atributos.push({ nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo });
        this.propiedadNueva.nombre = "";
        this.propiedadNueva.tipo = "";
    };
    CrearCategoriasComponent.prototype.removerPropiedad = function (i) {
        var _this = this;
        var propiedades = this.categoriaNueva.atributos.filter(function (element) { return element.nombre != _this.categoriaNueva.atributos[i].nombre; });
        this.categoriaNueva.atributos = propiedades;
    };
    CrearCategoriasComponent.prototype.terminarCreacion = function () {
        this.creacionTerminada.emit(true);
    };
    CrearCategoriasComponent.prototype.crearCategoria = function () {
        var _this = this;
        if (this.categoriaNueva.nombre == "") {
            return false;
        }
        if (this.categoriaNueva.descripcion == "") {
            return false;
        }
        this.loading = true;
        this.categoriasService.agregar(this.categoriaNueva).subscribe(function (data) {
            _this.loading = false;
            if (data.status == 201) {
                console.log(data);
                _this.paramCount = 0;
                _this.registrarParametros(data.body);
            }
            else {
                console.log(data);
            }
        }, function (error) {
            console.log(error);
        });
    };
    CrearCategoriasComponent.prototype.registrarParametros = function (categoria) {
        var _this = this;
        this.categoriaNueva.atributos.forEach(function (element) {
            var parametros = {
                "categoria": categoria.id,
                "nombre": element.nombre,
                "tipo": element.tipo
            };
            _this.categoriasService.crearParametros(parametros).subscribe(function (data) {
                _this.paramCount++;
                if (data.status == 201) {
                    console.log("parametro registrado");
                    console.log(data.body);
                    if (_this.paramCount == _this.categoriaNueva.atributos.length) {
                        _this.terminarCreacion();
                    }
                }
                else {
                    if (data.error) {
                    }
                    if (_this.paramCount == _this.categoriaNueva.atributos.length) {
                        _this.terminarCreacion();
                    }
                }
            }, function (error) {
                console.log(error);
            });
        });
    };
    __decorate([
        core_1.Input()
    ], CrearCategoriasComponent.prototype, "categoria");
    __decorate([
        core_1.Output()
    ], CrearCategoriasComponent.prototype, "creacionTerminada");
    CrearCategoriasComponent = __decorate([
        core_1.Component({
            selector: 'app-crear-categorias',
            templateUrl: './crear.component.html',
            styleUrls: ['./crear.component.css']
        })
    ], CrearCategoriasComponent);
    return CrearCategoriasComponent;
}());
exports.CrearCategoriasComponent = CrearCategoriasComponent;
