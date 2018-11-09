import { Component, OnInit, Input , Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {

	@Input() capasActivas;
  @Input() capas;
	@Input() estructuras;
	@Input() categorias;

  @Output() mapaRefrescadoRequerido = new EventEmitter<any>();
  @Output() coordenadaActualizada = new EventEmitter<any>();
  @Output() capaCerrada = new EventEmitter<any>();

  capaElegida: any;

  agregarDatosActivado: boolean;

  figura: any;
  color: any;

  constructor() { }

  ngOnInit() {
    
    this.figura = "circle-o";
    this.color = "#000000";

    this.agregarDatosActivado = false;
  }

  pedirRefrescarMapa(evento){

    this.mapaRefrescadoRequerido.emit(evento);
  }

  pedirTrancarExterno(evento){

    this.capaCerrada.emit(evento);
  }
  pedirActualizarGeojsonEditable(evento){


    this.coordenadaActualizada.emit(evento);
  }

  pedirTerminarAgregar(evento){

    this.mapaRefrescadoRequerido.emit(evento);
    this.agregarDatosActivado = false;
  }

  comenzarRegistro(evento){

    this.capaElegida = evento;
      
    this.elegirFigura();
    
    this.agregarDatosActivado = true;
  }
  
  elegirFigura(){

    let estruct = this.estructuras.find((element) =>{return element.nombre == this.capaElegida.nombre});
    
    if(estruct.geometria == "Point"){
      if(this.capaElegida.geojson.features.length > 0){
        this.figura = this.capaElegida.geojson.features[0].properties.figura;
        this.color = this.capaElegida.geojson.features[0].properties.color;
      }
      else{
        this.figura = "";
        this.color = "";
      }
    }
    else if(estruct.geometria == "Point"){
      if(this.capaElegida.geojson.features.length > 0){
        this.figura = this.capaElegida.geojson.features[0].properties.figura;
        this.color = this.capaElegida.geojson.features[0].properties.color;
      }
      else{
        this.figura = "";
        this.color = "";
      }
    }
    else{
      this.figura = null;
      this.color = null;
    }
    
  }

}
