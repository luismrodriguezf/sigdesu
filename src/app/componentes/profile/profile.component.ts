import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: any;
  nombre: any;
  apellido: any;
  loading: boolean;
  msgs: Message[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit() {
    let header = JSON.parse(localStorage.getItem('currentUser')).header
    this.authService.info(header).subscribe(data =>{
          let datos = data.body;
          this.email = datos.email;
          this.nombre = datos.first_name;
          this.apellido = datos.last_name;
       },error => {
          console.log(error);
       });
  }

  update(){
    let header = JSON.parse(localStorage.getItem('currentUser')).header;
    let user = {
        "username": this.email,
        "email": this.email,
        "first_name": this.nombre,
        "last_name": this.apellido
    }
    this.loading = true;
    this.msgs = [];
    this.authService.update(header, user).subscribe(data =>{
          let datos = data.body;
          this.email = datos.email;
          this.nombre = datos.first_name;
          this.apellido = datos.last_name;
          this.loading = false;
          this.msgs.push({severity:'success', summary:'Datos moficados exitosamente', detail:''});
       },error => {
          console.log(error);
          this.msgs.push({severity:'error', summary:'Datos incorrectos', detail:error});
          this.loading = false;
       });
  }

}
