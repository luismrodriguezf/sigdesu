import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoriasService } from '../../../services/categorias/categorias.service'

@Component({
  selector: 'app-buscar-categorias',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarCategoriasComponent implements OnInit {

	categorias: any;
	categoriaNueva: any;
	loading: boolean;

	@Output() categoriaCambiada = new EventEmitter<any>();
	@Output() categoriaActualizada = new EventEmitter<any>();
	@Output() categoriaEliminada = new EventEmitter<any>();
	@Output() administrarCapaRequerida = new EventEmitter<any>();


  constructor(private categoriasService: CategoriasService) { }

  ngOnInit() {

  	this.loading = false;

  	this.categoriaNueva = {
  		nombre: "",
  		descripcion: ""
  	}

  	this.loading = true;
	this.categoriasService.obtener().subscribe(data =>{
  	this.loading = false;
		console.log(data)
		if(data.status == 200){
		
			this.categorias = data.body;
		}
		else{
		  	console.log(data);
		}
	},
		error => {
			console.log(error);
		}
	);

  }//Cierre ngOnInit


  agregarCategoria(){
	this.categoriaCambiada.emit(this.categoriaNueva);
  }

  editarCategoria(categoria){
  	this.categoriaActualizada.emit(categoria);
  }

  eliminarCategoria(categoria){
  	this.categoriaEliminada.emit(categoria);
  }

  administrarCapasCategoria(categoria){
    console.log(categoria);
  	this.administrarCapaRequerida.emit(categoria);
  }

}