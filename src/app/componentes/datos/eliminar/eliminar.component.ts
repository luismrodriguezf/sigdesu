import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CapasService } from '../../../services/capas/capas.service';

@Component({
  selector: 'app-eliminar-datos',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarDatosComponent implements OnInit {

	@Input() dato;
	@Input() capa;
	@Input() estructura;
	@Input() posicion;

	@Output() eliminacionTerminada = new EventEmitter<any>();

	datoOriginal: any;

	loading: boolean;

  closeResult: string;

  constructor(private modalService: NgbModal, private capasService: CapasService) {}

  ngOnInit(){

  }

  open(content) {

  	this.datoOriginal = JSON.stringify(this.dato);

    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  actualizarDato(){

  	let geojson = {
  		"type": "FeatureCollection",
  		"features": []
  	}

  	this.dato.properties.eliminar = true;

  	geojson.features.push(this.dato);

  	console.log(geojson);

  	let dato = {
  		"nombre": this.capa,
  		"geojson": geojson
  	}

  	console.log(dato);
  	
    this.loading = true;
    this.capasService.editarDatos(dato).subscribe(data =>{
    this.loading = false;

        if(data.status == 200){

        	console.log(data.body);
			this.eliminacionTerminada.emit(data.body);
        	document.getElementById("cerrar").click();
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
