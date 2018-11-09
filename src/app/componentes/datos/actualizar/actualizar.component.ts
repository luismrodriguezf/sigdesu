import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CapasService } from '../../../services/capas/capas.service';

@Component({
  selector: 'app-actualizar-datos',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarDatosComponent implements OnInit {

	@Input() dato;
	@Input() capa;
	@Input() estructura;
	@Input() posicion;

	@Output() modificacionTerminada = new EventEmitter<any>();

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

  	this.dato.properties.modificar = true;

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
			this.modificacionTerminada.emit(data.body);
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
