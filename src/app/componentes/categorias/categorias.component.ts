import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

	crearActivado: boolean;
	editarActivado: boolean;
	borrarActivado: boolean;

	categoria: any;

  modalAbierta: boolean;

  modalRef: any;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {

    this.modalAbierta = false;

  	this.crearActivado = false;
  	this.editarActivado = false;
  	this.borrarActivado = false;
    eval("window.admincat = this");
  }


  open(content) {

    this.modalRef = this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.modalAbierta = true;
    }, (reason) => {
  
    });

  }

  cerrarModal() {
   
  }

  administrarCapa(categoria){

    console.log(categoria);
    window.localStorage.categoriaParaCapa = categoria.id;
    console.log(window.localStorage.categoriaParaCapa);
    setTimeout(()=>{

      console.log("Cerrando modal");    
      let el1 = <HTMLElement>document.querySelector("#botonCerrarCat");
      el1.click();
    },100);

    setTimeout(()=>{

      console.log("Abriendo la otra modal");    
      let el2 = <HTMLElement>document.querySelector("#abrirAdminCapa");
      el2.click();
    },200);

  }

  agregarCategoria(obj){
  	this.categoria = obj;
  	this.crearActivado = true;
  }  

  actualizarCategoria(obj){
  	this.categoria = obj;
  	this.editarActivado = true;
  }  

  eliminarCategoria(obj){
  	this.categoria = obj;
  	this.borrarActivado = true;
  }

  terminarCreacion(){

    this.reiniciarCategoria();

  	this.crearActivado = false;
  }

  terminarEdicion(){

    this.reiniciarCategoria();

  	this.editarActivado = false;
  }  

  terminarBorrado(){

    this.reiniciarCategoria();

  	this.borrarActivado = false;
  }

  reiniciarCategoria(){

    this.categoria = {
      nombre: "",
      descripcion: ""
    }

  }

}
