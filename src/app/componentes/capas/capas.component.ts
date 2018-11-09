import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../../services/categorias/categorias.service'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-capas',
  templateUrl: './capas.component.html',
  styleUrls: ['./capas.component.css']
})
export class CapasComponent implements OnInit {

	crearActivado: boolean;
	editarActivado: boolean;
	borrarActivado: boolean;

	capa: any;
  categorias: any;

  categoria: string;

  modalAbierta: boolean;

  filtrarEnCola: boolean;

  constructor(private categoriasService: CategoriasService, private modalService: NgbModal){ }

  ngOnInit() {

    this.modalAbierta = false;

    this.categorias = [];
    
    this.categoria = "";

    this.categoriasService.obtener().subscribe(data =>{
      console.log(data)
      if(data.status == 200){
      
        this.categorias = data.body;
        if(this.filtrarEnCola == true){
          this.filtrarCapasPorCategoria();
          this.filtrarEnCola = false;
        }
      }
      else{
          console.log(data);
      }
    },
      error => {
        console.log(error);
      }
    );

  	this.crearActivado = false;
  	this.editarActivado = false;
  	this.borrarActivado = false;
  }

  open(content) {

    let _self = this;

    if(window.localStorage.categoriaParaCapa){
      this.categoria = window.localStorage.categoriaParaCapa;
      window.localStorage.removeItem("categoriaParaCapa");
    }
    else{
      this.categoria = "";
    }

    this.crearActivado = false;
    this.editarActivado = false;
    this.borrarActivado = false;

    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.modalAbierta = true;
      setTimeout(()=>{
        _self.filtrarCapasPorCategoria();
      },250);
    }, (reason) => {
  
    });

  }

  filtrarCapasPorCategoria(){

    if(this.categorias){
      let el = <HTMLElement>document.querySelector("#filtrarCapasBoton");
      el.click();
    }
    else{
      this.filtrarEnCola = true;
    }
  }

  agregarCapa(obj){
    console.log(obj);
  	this.capa = obj;
  	this.crearActivado = true;
  }  

  actualizarCapa(obj){
  	this.capa = obj;
  	this.editarActivado = true;
  }  

  eliminarCapa(obj){
  	this.capa = obj;
  	this.borrarActivado = true;
  }

  terminarCreacion(){

  	this.reiniciarCapa();

  	this.crearActivado = false;
  }

  terminarEdicion(){

  	this.reiniciarCapa();

  	this.editarActivado = false;
  }  

  terminarBorrado(){

  	this.reiniciarCapa();

  	this.borrarActivado = false;
  }

  reiniciarCapa(){

  	this.capa = {
  		categoria: "",
  		nombre: "",
  		geometria: "",
  		propiedades: []
  	}

  }

}
