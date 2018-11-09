import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-crear-categorias',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearCategoriasComponent implements OnInit {

  loading: boolean;
  categoriaNueva: any;
  propiedadNueva: any;

  paramCount: number;

  @Input() categoria: any;
  @Output() creacionTerminada = new EventEmitter<boolean>();

  constructor(private categoriasService: CategoriasService,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.loading = false;
    this.categoriaNueva = this.categoria;
    this.categoriaNueva.atributos = [];

    this.propiedadNueva = {
      nombre: "",
      tipo: ""
    }
  }

  agregarPropiedad(){

    if(this.propiedadNueva.nombre == ""){
      return false;
    }   

    if(this.propiedadNueva.tipo == ""){
      return false;
    }

    if( this.categoriaNueva.atributos.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
      return false;
    }

    this.categoriaNueva.atributos.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo});

    this.propiedadNueva.nombre = "";
    this.propiedadNueva.tipo = "";
  }

  removerPropiedad(i){

    let propiedades = this.categoriaNueva.atributos.filter((element) =>{return element.nombre != this.categoriaNueva.atributos[i].nombre});
    this.categoriaNueva.atributos = propiedades;
  }

  terminarCreacion(){
    this.creacionTerminada.emit(true);
  }

  crearCategoria(){

    if(this.categoriaNueva.nombre == ""){
      return false;
    }

    if(this.categoriaNueva.descripcion == ""){
      return false;
    }

    this.loading = true;
    this.categoriasService.agregar(this.categoriaNueva).subscribe(data =>{
    this.loading = false;

        if(data.status == 201){

          console.log(data);
          this.paramCount = 0;
          this.registrarParametros(data.body);
        }
        else{

          console.log(data);
        }
      },
      error => {
        console.log(error);
      }
    );

  }


  registrarParametros(categoria){


    this.categoriaNueva.atributos.forEach((element) =>{

      let parametros = {

        "categoria": categoria.id,
        "nombre": element.nombre,
        "tipo": element.tipo
      }


      this.categoriasService.crearParametros(parametros).subscribe(data =>{

          this.paramCount++;

          if(data.status == 201){
          
            console.log("parametro registrado");
            console.log(data.body);
            if(this.paramCount == this.categoriaNueva.atributos.length){
              this.terminarCreacion();
            }

          }
          else{
            
            if(data.error){
                for(let prop in data.error){
                	this.flashMessage.show(data.error[prop], { cssClass: 'alert-danger', timeout: 3000 });                  
                }
            }

            if(this.paramCount == this.categoriaNueva.atributos.length){
              this.terminarCreacion();
            }

          }
        },
        error => {
          console.log(error);
        }
      );


    });




  }


}
