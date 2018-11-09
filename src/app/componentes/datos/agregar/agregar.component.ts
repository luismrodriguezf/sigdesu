import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'
import { CategoriasService } from '../../../services/categorias/categorias.service'

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-agregar-datos',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})

export class AgregarDatosComponent implements OnInit {


	@Input() categorias;
  @Input() estructuras;
  @Input() capas;
  @Input() capasActivas;
	@Input() capaElegida;

  @Input() figura;
  @Input() color;
  @Input() registros;

  @Output() agregarTerminado = new EventEmitter<any>();
  @Output() capaCerrada = new EventEmitter<any>();
	@Output() coordenadaActualizada = new EventEmitter<any>();

	categoria: any;
	capa: any;
	capaActiva: any;
	capasFiltradas: any;
  coordenadaNueva: any;
  capaNueva: any;

  atributos: any;

  checkCoordVar: any;

  loading: boolean;

  estructuraActiva: any;

  iconos: string[];

  modalRef: any;

  constructor(
  			private categoriasService: CategoriasService,
  			private capasService: CapasService,
        private modalService: NgbModal) {}

  ngOnInit() {

  	eval("window.yo2 = this");

    this.inicializarIconos();

    this.loading = false;
    this.atributos = {};

  	this.categoria = "";
  	this.capa = "";
  	this.capasFiltradas = [];

    let estruct = this.estructuras.find((element) =>{return element.nombre == this.capaElegida.nombre});
    this.elegirCapa(estruct);

    this.coordenadaNueva = {
      longitud: 0,
      latitud: 0
    };

  }


  checkCoordFunction(){

    let add = this;

    function check(){

      if(window.localStorage.coordenadas){

        let coordenadas = window.localStorage.coordenadas;
        let coordenadas2 = JSON.stringify(add.capaActiva.coordenadas);
        if (coordenadas != coordenadas2){
          console.log(coordenadas);
          add.capaActiva.coordenadas = JSON.parse(coordenadas);
        }
        add.evaluarCierre();
      }
    }

    this.checkCoordVar = setInterval(check, 500);
  }

  checkCoord(este){
      console.log("Quiero entrar");
    if(window.localStorage.coordenadas){
      console.log("Entre");
      este.capaActiva.coordenadas = JSON.parse(window.localStorage.coordenadas);
      este.evaluarCierre();
    }
  }


  filtrarCapas(){

    if(this.checkCoordVar) clearInterval(this.checkCoordVar);
  	
    this.capaActiva = {};
    this.atributos = {};

    this.capasFiltradas = this.capas.filter((element) =>{return element.categoria.id == this.categoria});
  }

  elegirCapa(estruct){

    if(this.checkCoordVar) clearInterval(this.checkCoordVar);

  	this.capaActiva = estruct;
    this.estructuraActiva = estruct.atributos.filter((element) =>{return element.nombre != "geom"});

    this.atributos = {};

    this.capaActiva.atributos.forEach((element) =>{
      if(element.nombre!='geom'){
        if(element.nombre == "figura" || element.nombre == "color"){
          this.atributos[""+element.nombre] = element.tipo;
        }
        else{
          this.atributos[""+element.nombre] = element.tipo == 'Text' ?  "" : 0;
        }
      }
    });

    this.capaActiva.cerrada = false;
    this.ambientarCoordenadas();  
  
    window.localStorage.capaActiva = JSON.stringify(this.capaActiva);

    this.checkCoordFunction();
  }

  ambientarCoordenadas(){
    
    if(window.localStorage.coordenadas) window.localStorage.removeItem("coordenadas");


    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = [];
      break;

      case "LineString":

        this.capaActiva.coordenadas = [];
      break;

      case "Polygon":

        this.capaActiva.coordenadas = [
          [
          ]
        ]
      break;

    }

    window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);

  }

  evaluarCierre(){

    console.log(this.capaActiva.geometria);

    switch(this.capaActiva.geometria){

      case "Point":

        if(this.capaActiva.coordenadas.length){
          this.capaActiva.cerrada = true;
        }
        else{
          this.capaActiva.cerrada = false;        
        }
      break;      

      case "LineString":

        this.capaActiva.cerrada = false;
      break;      

      case "Polygon":

        let largo = this.capaActiva.coordenadas[0].length;

        if(!largo){

          this.capaActiva.cerrada = false;        
        }
        else{

          if(largo < 3){

            this.capaActiva.cerrada = false;        
          }
          else{

            let ln1 = this.capaActiva.coordenadas[0][0][0];
            let lt1 = this.capaActiva.coordenadas[0][0][1];
            let ln2 = this.capaActiva.coordenadas[0][largo-1][0];
            let lt2 = this.capaActiva.coordenadas[0][largo-1][1];

            if( (ln1 == ln2) && (lt1 == lt2) ){
              this.capaActiva.cerrada = true;
              this.capaCerrada.emit(true);
            }
            else{
              this.capaActiva.cerrada = false;
            }

          }
        }

      break;

    }
  }

  evaluarApertura(){

    switch(this.capaActiva.geometria){

      case "Point":

        console.log("Entre en Point");
        this.capaActiva.cerrada = false;
      break;      

      case "LineString":

        console.log("Entre en LineString");
        this.capaActiva.cerrada = false;
      break;      

      case "Polygon":

        console.log("Entre en Polygon");
        let largo = this.capaActiva.coordenadas[0].length;

        if(largo == 1) return false;

        let ln1 = this.capaActiva.coordenadas[0][0][0];
        let lt1 = this.capaActiva.coordenadas[0][0][1];
        let ln2 = this.capaActiva.coordenadas[0][largo-1][0];
        let lt2 = this.capaActiva.coordenadas[0][largo-1][1];
        if( (ln1 != ln2) || (lt1 != lt2) ){
          this.capaActiva.cerrada = false;
        }
        else{
          this.capaActiva.cerrada = true;
        }
      break;

    }  }

  agregarCoordenada(lng, lat){


    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = [lng, lat];
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
      break;

      case "LineString":

        this.capaActiva.coordenadas.push([lng, lat]);
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
      break;

      case "Polygon":

        this.capaActiva.coordenadas[0].push([lng, lat]);
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
      break;

    }

    this.coordenadaNueva.longitud = 0;
    this.coordenadaNueva.latitud = 0;

    this.evaluarCierre();
    this.coordenadaActualizada.emit({geom: this.capaActiva.geometria, tipo: "add", cerrada: this.capaActiva.cerrada});

  }

  removerCoordenada(pos){

    let coordenadas = [];
    let i = 0;
    console.log(this.capaActiva.coordenadas);

    switch(this.capaActiva.geometria){

      case "Point":

        this.capaActiva.coordenadas = coordenadas;
        window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);

      break;

      case "LineString":
    
        this.capaActiva.coordenadas.forEach((element) =>{

          if(i != pos){
            coordenadas.push(element);
          }

          i++;
        });
        this.capaActiva.coordenadas = coordenadas;
        window.localStorage.coordenadas = JSON.stringify(coordenadas);

      break;

      case "Polygon":

        coordenadas.push([]);

        this.capaActiva.coordenadas[0].forEach((element) =>{

          if(i != pos){
            coordenadas[0].push(element);
          }

          i++;
        });

        this.capaActiva.coordenadas = coordenadas;

        window.localStorage.coordenadas = JSON.stringify(coordenadas);

      break;

    }

    this.coordenadaActualizada.emit({geom: this.capaActiva.geometria, tipo: "remove"});
    this.evaluarApertura();
  }


  bajarCoordenada(pos){

    let coord1;
    let coord2;

    if(this.capaActiva.tipo == "LineString"){

      coord1 = [this.capaActiva.coordenadas[pos][0],this.capaActiva.coordenadas[pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[pos+1][0], this.capaActiva.coordenadas[pos+1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos+1);
    
    }    

    if(this.capaActiva.tipo == "Polygon"){

      coord1 = [this.capaActiva.coordenadas[0][pos][0],this.capaActiva.coordenadas[0][pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[0][pos+1][0], this.capaActiva.coordenadas[0][pos+1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos+1);
    
    }
  }

  subirCoordenada(pos){

    let coord1;
    let coord2;

    if(this.capaActiva.tipo == "LineString"){

      coord1 = [this.capaActiva.coordenadas[pos][0],this.capaActiva.coordenadas[pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[pos-1][0], this.capaActiva.coordenadas[pos-1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos-1);
    
    }    

    if(this.capaActiva.tipo == "Polygon"){

      coord1 = [this.capaActiva.coordenadas[0][pos][0],this.capaActiva.coordenadas[0][pos][1]];
      console.log(coord1);

      coord2 = [this.capaActiva.coordenadas[0][pos-1][0], this.capaActiva.coordenadas[0][pos-1][1]];
      console.log(coord2);
      
      this.intercambiarCoordenadas(coord1, coord2, pos, pos-1);
    
    }

  }

  intercambiarCoordenadas(coord1, coord2, pos, pos2){

    if(this.capaActiva.tipo == "LineString"){

      this.capaActiva.coordenadas[pos] = coord2;
      this.capaActiva.coordenadas[pos2] = coord1;
    }

    if(this.capaActiva.tipo == "Polygon"){

      this.capaActiva.coordenadas[0][pos] = coord2;
      this.capaActiva.coordenadas[0][pos2] = coord1;
    }

    window.localStorage.coordenadas = JSON.stringify(this.capaActiva.coordenadas);
    this.coordenadaActualizada.emit({geom: this.capaActiva.geometria, tipo: "remove"});
    this.evaluarApertura();
    this.evaluarCierre();

  }

  agregarDato(){

  console.log(this.capaActiva);
  console.log(this.atributos);

    this.atributos.nuevo = true;
    
    if(this.capaActiva.tipo == "Point"){
      
      if(this.figura == ""){
        return false;
      }
      if(this.color == ""){
        return false;
      }
      this.atributos["figura"] = this.figura;
      this.atributos["color"] = this.color;
    }
    if(this.capaActiva.tipo == "MultiPoint"){

      if(this.figura == ""){
        return false;
      }
      if(this.color == ""){
        return false;
      }
      this.atributos["figura"] = this.figura;
      this.atributos["color"] = this.color;
    }

    let datos = {
      "nombre": this.capaActiva.nombre,
      "geojson": {
        "type": "FeatureCollection",
        "features": [{
          "type": "feature",
          "geometry": {
            "type": this.capaActiva.tipo,
            "coordinates": this.capaActiva.coordenadas
          },
          "properties": this.atributos,
        }]
      }
    }

    console.log(datos);

    this.loading = true;
    this.capasService.editarDatos(datos).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){

          window.localStorage.removeItem("capaActiva");
          window.localStorage.lastLayer = this.capaActiva.nombre;
          this.terminarAgregar({"nombre": this.capaActiva.nombre, "geojson": data.body});
        }
        else{


        }
      },
      error => {
       this.loading = false;
       console.log(error);
      }
    );
  }

  terminarAgregar(evento){

    if(!evento){

    }
    clearInterval(this.checkCoordVar);
    this.agregarTerminado.emit(evento);
  }


  inicializarIconos(){

    this.iconos = [
      "circle",
      "circle-o",
      "times-circle",
      "square",
      "square-o",
      "window-close-o",
      "exclamation-triangle",
      "bullseye"
    ];

  }

  open(content) {

    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then((result) => {

      console.log("Saludos");

    }, (reason) => {

    });
  }

  elegirIcono(icono){
    this.figura = icono;
    this.modalRef.close();
  }


}
