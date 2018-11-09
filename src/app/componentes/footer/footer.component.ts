import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  ventanas: any[];
  investigadores: any[];
  desarrolladores: any[];

  ventanaActiva: any;

  modalRef: any;

  contador: any[];


  constructor(private modalService: NgbModal) { }


  ngOnInit() {

    this.contador = [0,1,2,3];

    this.ventanas = [
      {
        "corto": "Proyecto",
        "nombre": "Proyecto"
      },
      {
        "corto": "Contactanos",
        "nombre": "Contactanos"
      },
      {
        "corto": "Términos y Condiciones", 
        "nombre": "Términos y Condiciones"
      },
      {
        "corto": "Acerca de",
        "nombre": "Acerca de"
      },
      {
        "corto": "Investigadores",
        "nombre": "Investigadores"
      },
      {
        "corto1": "Analistas y",
        "corto2": "Desarrolladores",
        "nombre": "Analistas y Desarrolladores"
      }
    ];
    this.investigadores = [
      {
      "nombre": "MSc. Luis M. Rodriguez",
      "correo": "luismrodriguezf@gmail.com",
      "telefono": "0416-8945712",
      "foto": "luism.jpeg"
      },
      {
      "nombre": "Licdo. Jesus Francisco Marquez",
      "correo": "Jesus@gmail.com",
      "telefono": "0414-8242002",
      "foto": "francisco.jpeg"
      },
      {
      "nombre": "MSc. Yadeivis de Marquez",
      "correo": "Yadeivis@gmail.com",
      "telefono": "0416-8936376",
      "foto": "ysimar.jpg"
      }
    ];
    this.desarrolladores = [
      [{
        "nombre": "MSc. Luis M. Rodriguez",
        "correo": "luismrodriguezf@gmail.com",
        "telefono": "0416-8945712",
        "foto": "luism.jpeg"
      },{
        "nombre": "TSU. Benjamin Escobar",
        "correo": "benjamin.s1.e@gmail.com",
        "telefono": "0416-0337683",
        "foto": "benjamin.jpg"
      },{
        "nombre": "Ing. Carlos Cercado",
        "correo": "cercadocarlos@gmail.com",
        "telefono": "0426-3814727",
        "foto": "cercado.png"
      }]
    ];
  }

  abrirModal(ventana, content){
    this.seleccionarVentana(ventana);

    this.modalRef = this.modalService.open(content, { size: 'lg' }).result.then((result) => {

    }, (reason) => {
  
    });
  }

  seleccionarVentana(ventana){
    this.ventanaActiva = ventana;
  }

  open(content) {

    this.modalService.open(content,{ size: 'lg' }).result.then((result) => {

    console.log("Saludos");
    }, (reason) => {

    });
  }


}

