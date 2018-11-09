import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'
import { CategoriasService } from '../../../services/categorias/categorias.service'
 @Component({
  selector: 'app-crear-capas',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearCapasComponent implements OnInit {
   loading: boolean;
   capaNueva: any;
   propiedadNueva: any;
   categorias: any;
  
  figura: string;
  color: string;
   @Input() capa: any;
  @Output() creacionTerminada = new EventEmitter<boolean>();
   constructor(
  			private capasService: CapasService,
  			private categoriasService: CategoriasService){}
   ngOnInit() {
     this.loading = false;
    
    this.inicializarFigura();
   	this.propiedadNueva = {
  		nombre: "",
  		tipo: ""
  	}
     this.capaNueva = this.capa;
     this.loading = true;
  	this.categoriasService.obtener().subscribe(data =>{
    this.loading = false;
   		if(data.status == 200){			
         console.log(data);
  			this.categorias = data.body;
  		}
  		else{
  		  	this.categorias = [];
  		}
  	},
  		error => {
  			console.log(error);
  		}
  	);
     eval("window.yo = this");
  }
   agregarPropiedad(){
   	if(this.propiedadNueva.nombre == ""){
  		return false;
  	}  	
   	if(this.propiedadNueva.tipo == ""){
  		return false;
  	}
   	if( this.capaNueva.atributos.find((element) =>{return element.nombre == this.propiedadNueva.nombre}) ){
  		return false;
  	}
     if( this.capaNueva.atributos.find((element) =>{return element.tipo == "Pic"}) ){
      return false;
    }
   	this.capaNueva.atributos.push({nombre: this.propiedadNueva.nombre, tipo: this.propiedadNueva.tipo});
   	this.propiedadNueva.nombre = "";
  	this.propiedadNueva.tipo = "";
   }
   removerPropiedad(i){
   	let propiedades = this.capaNueva.atributos.filter((element) =>{return element.nombre != this.capaNueva.atributos[i].nombre});
  	this.capaNueva.atributos = propiedades;
  }
   terminarCreacion(){
     this.creacionTerminada.emit(true);
  }
   crearCapa(){
 //    this.capaNueva.atributos.push({"nombre": "geom", "tipo":this.capaNueva.geometria});
    this.capaNueva.tipo = this.capaNueva.geometria;
     console.log(this.capaNueva);
    
    if(this.capaNueva.tipo == "Point" || this.capaNueva.tipo == "MultiPoint"){
      this.capaNueva.atributos.push({"nombre": "figura", "tipo": "Text"});
      this.capaNueva.atributos.push({"nombre": "color", "tipo": "Text"});
    }
     this.loading = true;
    this.capasService.agregar(this.capaNueva).subscribe(data =>{
    this.loading = false;
         if(data.status == 201){
           console.log(data.body);
          this.registrarAtributos(data.body);
        }
        else{
         }
      },
      error => {
        console.log(error);
      }
    );
   }
   registrarAtributos(capa){
     this.capaNueva.atributos.forEach((element) =>{
       let atributos = {
         "descripcion": "Sin descripcion",
        "capa": capa.id,
        "nombre": element.nombre,
        "tipo": element.tipo
      }
       this.capasService.crearAtributos(atributos).subscribe(data =>{
           if(data.status == 201){
          
            console.log("atributo registrado");
            console.log(data.body);
            if(data.body.nombre == this.capaNueva.atributos[this.capaNueva.atributos.length-1].nombre){
              this.terminarCreacion();
            }
           }
          else{
           }
        },
        error => {
          console.log(error);
        }
      );
     });
   }
  
  inicializarFigura(){
    this.color = "#0000FF";
    this.figura = "";
  }
 } 