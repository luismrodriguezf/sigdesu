import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-eliminar-capas',
  templateUrl: './eliminar.component.html',
  styleUrls: ['./eliminar.component.css']
})
export class EliminarCapasComponent implements OnInit {

  loading: boolean;

  @Input() categorias: any;
  @Input() capa: any;
  @Output() borradoTerminado = new EventEmitter<boolean>();

  constructor(private capasService: CapasService) { }

  ngOnInit() {

    this.loading = false;
  }

  terminarBorrado(){
    this.borradoTerminado.emit(true);
  }

  eliminarCapa(){

    this.loading = true;
    this.capasService.eliminar(this.capa).subscribe(data =>{
    this.loading = false;

        if(data.status == 204){

          this.terminarBorrado();
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


}
