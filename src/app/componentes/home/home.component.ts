import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images: any[];

  constructor() { }

  ngOnInit() {
        this.images = [];
        this.images.push({source:'assets/images/indio.jpg', title:'El indio de Cumaná'});
        this.images.push({source:'assets/images/altagracia.jpg', title:'Calle el alacrán'});
        this.images.push({source:'assets/images/arriba.jpg', title:'Cumaná'});
  }

}
