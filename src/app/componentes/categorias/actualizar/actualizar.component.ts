import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-actualizar-categorias',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarCategoriasComponent implements OnInit {

  removidos: any;
  agregados: any;

  cantidadAgregados: number;
  cantidadEliminados: number;


  loading: boolean;

  @Input() categoria: any;
  @Output() edicionTerminada = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService) { }

  propiedadNueva: any;


  ngOnInit() {

    this.propiedadNueva = {
      nombre: "",
      tipo: "",
    }


    this.loading = false;
  }

  terminarEdicion(){
    this.edicionTerminada.emit(true);
  }

  removerPropiedad(i){

    let viejo = this.categoria.parametros.find((element) =>{return element.id == this.categoria.parametros[i].id});
    let parametros = this.categoria.parametros.filter((element) =>{return element.nombre != this.categoria.parametros[i].nombre});
    this.categoria.parametros = parametros;
    this.removidos.push(viejo);
  }


  agregarPropiedad(){

    if(this.propiedadNueva.nombre == ""){
      return false;
    }   

    if(this.propiedadNueva.tipo == ""){
      return false;
    }

    if( this.categoria.parametros.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
      return false;
    }

    this.categoria.parametros.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo, categoria: this.categoria.id});

    this.agregados.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo, categoria: this.categoria.id});
    this.propiedadNueva.nombre = "";
    this.propiedadNueva.tipo = "";

  }


  actualizarCategoria(){

    if(this.categoria.nombre == ""){
      return false;
    }

    if(this.categoria.categoria == ""){
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


  registrarAtributos(parametro){


      this.categoriasService.crearParametros(parametro).subscribe(data =>{

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

  removerAtributos(parametro){


      this.categoriasService.eliminarParametros(parametro.id).subscribe(data =>{

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
