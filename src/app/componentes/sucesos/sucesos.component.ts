import { Component, OnInit } from '@angular/core';
import {SucesosService} from '../../services/sucesos.service';
import {CasosService} from '../../services/casos.service';
import * as L from 'leaflet';
import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-sucesos',
  templateUrl: './sucesos.component.html',
  styleUrls: ['./sucesos.component.css']
})
export class SucesosComponent implements OnInit {
  sucesos: any;
  suceso: any;
  casos: any;
  modal_registro_suceso: boolean = false;
  msgs: Message[] = [];
  detalle: boolean = false;
  mapa: boolean;
  mmap: any;
  nombre: any;
  fecha: any;
  hoy: any = new Date();
  loading: boolean = false;
  loading2: boolean = false;
  osm_provider: any = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMaps | CSUDO'
          });
  constructor(private sucesosService: SucesosService, private casosService: CasosService) { }

  ngOnInit() {
      this.sucesos = [];
      this.get_lista_sucesos();
      this.iniciar_visor_mapa();
  }

  iniciar_visor_mapa(){
    this.mmap = L.map('mmap', {
            center: [10.456389, -64.1675],
            zoom: 13,
            layers: [this.osm_provider]
           });
  }

  get_lista_sucesos(){
    this.sucesos = [];
    this.loading2 = true;
    this.sucesosService.all().subscribe(data =>{
      data.body.forEach((element) =>{
        this.sucesos.push(element);
      });
      this.loading2 = false;
    },
    error => {
      console.log(error);
      this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
      this.loading2 = false;
    });
  }

  eliminar_caso(caso_id: any){
    this.loading = true;
      this.casosService.delete(caso_id).subscribe(data => {
          this.sucesosService.get(this.suceso).subscribe(data => {
               this.casos = data.body.casos;
               this.msgs = [];
               this.msgs.push({severity:'success', summary:'Eliminado exitosamente', detail:''});
               this.get_lista_sucesos();
               this.loading = false;
          }, error =>{
              console.log(error);
              this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
              this.loading = false;
          });
      }, error =>{
          console.log(error);
          this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
          this.loading = false;
      });
  }

  eliminar_suceso(suceso_id: any){
    this.loading2 = true;
      this.sucesosService.delete(suceso_id).subscribe(data => {
        this.sucesos = this.sucesos.filter(suceso => suceso.id != suceso_id);
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Eliminado exitosamente', detail:''});
        this.loading2 = false;
      }, error =>{
          console.log(error);
          this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
          this.loading2 = false;
      });
  }

   ver_casos(suceso: any) {
       this.suceso = suceso.id;
        this.casos = suceso.casos;
        this.detalle = true;
    }

    cambiar_visibilidad(caso_id: any) {
        this.loading = true;
        this.casosService.change_state(caso_id).subscribe(data => {
            this.sucesosService.get(this.suceso).subscribe(data => {
                 this.casos = data.body.casos;
                 this.msgs = [];
                 this.msgs.push({severity:'success', summary:'Cambio exitoso', detail:''});
                 this.get_lista_sucesos();
                 this.loading = false;
            }, error =>{
                console.log(error);
                this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
                this.loading = false;
            });
        }, error =>{
            console.log(error);
            this.msgs.push({severity:'error', summary:'Error de conexion', detail:'no se encontraron los sucesos'});
            this.loading = false;
        });
    }

    ver_mapa(suceso: any){
        this.mmap.eachLayer((layer) => {
          if (layer._url != "http://{s}.tile.osm.org/{z}/{x}/{y}.png"){
              this.mmap.removeLayer(layer);}
        });
        this.mapa = true;
        let punto = null;
        suceso.casos.forEach((element) =>{
            if (element.visible){
            punto = L.marker(L.latLng(element.lat, element.lng), {
                icon: L.icon({
                    iconSize: [ 25, 41 ],
                    iconAnchor: [ 13, 41 ],
                    iconUrl: 'leaflet/marker-icon.png',
                    shadowUrl: 'leaflet/marker-shadow.png'
                  })
              });
              punto.bindPopup("Caso: "+element.descripcion+"<br/>Fecha: "+element.fecha);
              punto.addTo(this.mmap);
            }
        });

    }

    registrar_suceso(){
    if (this.validar())
    {
        let datos = {
            "nombre": this.nombre,
            "fecha": this.fecha
        }

        this.loading2 = true;
        this.sucesosService.post(datos).subscribe(data =>{
            this.msgs.push({severity:'success', summary:'Suceso registrado exitosamente', detail:''});
            this.loading2 = false;
            this.modal_registro_suceso = false;
            this.get_lista_sucesos();
        },
        error => {
          console.log(error);
          this.msgs.push({severity:'error', summary:'Error al registrar', detail:''});
          this.loading2 = false;
        });
    }
    }

    validar(){
    let res = true;
        if(this.nombre == null)
        {
            res = false
            this.msgs.push({severity:'error', summary:'Nombre', detail:'es requerido'});
        }
        if (this.fecha == null){
              res = false;
              this.msgs.push({severity:'error', summary:'Fecha', detail:'es requerida'});
            }
            return res;
    }

    modal_registro(){
      this.modal_registro_suceso = true;
    }

}
