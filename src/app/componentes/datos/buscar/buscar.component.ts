import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service';
import { CategoriasService } from '../../../services/categorias/categorias.service';

@Component({
  selector: 'app-buscar-datos',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarDatosComponent implements OnInit {

  loading: boolean;

	@Input() categorias;
	@Input() capas;
	@Input() capasActivas;
	@Input() estructuras;

	@Output() capaRefrescada = new EventEmitter<any>();
	@Output() registroNuevoRequerido = new EventEmitter<any>();


	capa: string;
	capaActiva: any;
	estructuraActiva: any;
	capaPaginada: any;
	paginaActiva: any;
	atributos: any;
	numeroPagina: number;

  constructor() { }

  ngOnInit() {

  	eval("window.buscarDatos = this");

  	this.estructuraActiva = [];
  	this.atributos = [];
  	this.capaPaginada = [];
  	this.paginaActiva = [];
  	this.numeroPagina = 0;
  	this.capa = "";

    if(window.localStorage.lastLayer){
      this.capa = window.localStorage.lastLayer;
      this.seleccionarCapa();
    }

  }


  comenzarRegistro(){

  	this.registroNuevoRequerido.emit(this.capaActiva);
  }

  refrescarCapas(evento, tipo){

  	this.capaActiva.geojson = evento;
  	this.paginarCapa();
	this.capaRefrescada.emit(this.capaActiva);
  }

  paginarCapa(){

  	this.capaPaginada = [];

  	for(let i = 0, j = this.capaActiva.geojson.features.length, k = 0; i<j; i++){

  		if(i%5==0){

  			this.capaPaginada.push([]);
  			k++;
  		}

  		this.capaPaginada[k-1].push(this.capaActiva.geojson.features[i]);
  	}

  	this.numeroPagina = 0;
  	this.paginaActiva = this.capaPaginada[this.numeroPagina];

  }

  seleccionarCapa(){

    window.localStorage.lastLayer = this.capa;

  	let estruct = this.estructuras.find((element) =>{return element.nombre == this.capa});
  	this.estructuraActiva = estruct.atributos.filter((element) =>{return (element.nombre != "geom")&&(element.nombre != "pk")&&(element.nombre != "color")&&(element.nombre != "figura")});
  	this.capaActiva = this.capas.find((element) =>{return element.nombre == this.capa});
  	this.paginarCapa();
  }

  retrocederPagina(){

	this.numeroPagina--;
	this.paginaActiva = this.capaPaginada[this.numeroPagina];
  }
  avanzarPagina(){

	this.numeroPagina++;
	this.paginaActiva = this.capaPaginada[this.numeroPagina];
  }

}
