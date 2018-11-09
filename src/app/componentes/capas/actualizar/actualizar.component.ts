import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-actualizar-capas',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarCapasComponent implements OnInit {

  removidos: any;
  agregados: any;

  cantidadAgregados: number;
  cantidadEliminados: number;

  loading: boolean;

  @Input() categorias: any;
  @Input() capa: any;
  @Output() edicionTerminada = new EventEmitter<boolean>();

  propiedadNueva: any;

  constructor(private capasService: CapasService) { }

  ngOnInit() {

    this.removidos = [];
    this.agregados = [];

    this.cantidadAgregados = 0;
    this.cantidadEliminados = 0;

    eval("window.yo = this");

    this.loading = false;

  	this.propiedadNueva = {
  		nombre: "",
  		tipo: "",
  	}

    console.log(this.capa);
    console.log(this.categorias);

    document.querySelector("body > ngb-modal-window > div").setAttribute("style","max-width: 600px;");

  }

  cambiarCategoria(){

    this.capa.categoria = this.categorias.find((element) =>{return element.id == this.capa.categoria.id});

  }

  agregarPropiedad(){

  	if(this.propiedadNueva.nombre == ""){
  		return false;
  	}  	

  	if(this.propiedadNueva.tipo == ""){
  		return false;
  	}

  	if( this.capa.atributos.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
  		return false;
  	}

  	this.capa.atributos.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo, capa: this.capa.id, descripcion: "Sin descripcion"});

    this.agregados.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo, capa: this.capa.id, descripcion: "Sin descripcion"});
  	this.propiedadNueva.nombre = "";
  	this.propiedadNueva.tipo = "";

  }

  removerPropiedad(i){

    let viejo = this.capa.atributos.find((element) =>{return element.id == this.capa.atributos[i].id});
  	let atributos = this.capa.atributos.filter((element) =>{return element.nombre != this.capa.atributos[i].nombre});
  	this.capa.atributos = atributos;
    this.removidos.push(viejo);
  }


  terminarEdicion(){
    this.edicionTerminada.emit(true);
  }

  actualizarCapa(){

    if(this.capa.nombre == ""){
      return false;
    }

    if(this.capa.categoria == ""){
      return false;
    }

    this.loading = true;
    
    this.agregados.forEach((element) =>{

      this.registrarAtributos(element);

    });


    this.removidos.forEach((element) =>{

      this.removerAtributos(element);

    });


  }


  registrarAtributos(atributo){


      this.capasService.crearAtributos(atributo).subscribe(data =>{

          if(data.status == 201){
          
            this.cantidadAgregados++;

            if( (this.cantidadAgregados == this.agregados.length) && (this.cantidadEliminados == this.removidos.length) ){

              this.loading = false;
              this.terminarEdicion();
            }

          }
          else{


          }
        },
        error => {
          console.log(error);
        }
      );

  }  

  removerAtributos(atributo){


      this.capasService.eliminarAtributos(atributo.id).subscribe(data =>{

          if(data.status == 204){
          
            this.cantidadEliminados++;

            if( (this.cantidadAgregados == this.agregados.length) && (this.cantidadEliminados == this.removidos.length) ){
              this.loading = false;
              this.terminarEdicion();
            }


          }
          else{


          }
        },
        error => {
          console.log(error);
        }
      );

  }



}



/*

    this.loading = true;
    this.capasService.actualizar(this.capa).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){

          this.terminarEdicion();
        }
        else{

        }
      },
      error => {
        console.log(error);
      }
    );


*/