import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CapasService } from '../../../services/capas/capas.service'

@Component({
  selector: 'app-importar-content',
  styleUrls: ['./content.component.css'],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Importar Capas</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">

    	<div class="row">
    	<div class="col-12">

			<form>

		    	<div class="row">
		    	<div class="form-group col-12">

		    		<label class="control-label" for="nombre_capa">Nombre de capa</label>
		    		<input type="text" class="form-control" name="nombre_capa" [(ngModel)]="nombre_capa" maxlength="20">
				</div>
				</div>

		    	<div class="row">
		    	<div class="form-group col-12">

		    		<label class="control-label" for="categoria">Categoría</label>
					<select class="form-control" name="categoria" [(ngModel)]="categoria">
						<option value="0" selected disabled>Seleccione una categoria</option>
						<option *ngFor="let cat of categorias" [value]="cat.id">{{cat.nombre}}</option>
					</select>
				</div>
				</div>


		    	<div class="row">
		    	<div class="form-group col-12">

		    		<label class="control-label" for="tipo_archivo">Tipo de archivo</label>
					<select class="form-control" name="tipo_archivo" [(ngModel)]="tipo_archivo">
						<option value="" selected disabled>Seleccione un tipo de archivo</option>
						<option value="zip">Shapefile</option>
						<option value="csv">CSV</option>
						<option value="kml">KML</option>
						<option value="gpx">GPX</option>
						<option value="wkt">WKT</option>
						<option value="topojson">TopoJSON</option>
						<option value="geojson">GeoJSON</option>
					</select>
				</div>
				</div>

		    	<div class="row">
		    	<div class="form-group col-4">

					<button type="button" class="btn btn-outline-primary" *ngIf="tipo_archivo!=''" (click)="clickFileInput()">Cargar<i class="fa fa-file-archive-o" aria-hidden="true"></i></button>
					<input type="file" name="file" id="geofile" [accept]="'.'+tipo_archivo" *ngIf="tipo_archivo!=''" style="display: none" (change)="cargarArchivo($event)">
				</div>
		    	<div class="form-group col-4">

					<button type="button" [class]="button_class" *ngIf="tipo_archivo!=''" (click)="importarGeojson()" [disabled]="button_class!='btn btn-outline-success'">Enviar<i class="fa fa-upload" aria-hidden="true"></i></button>
				</div>
				</div>

			</form>
    	</div>
    	</div>

    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
	<i class="fa fa-spinner fa-pulse fa-2x fa-fw" *ngIf="loading"></i>    
  `
})
export class ImportarCapasContent {

  @Input() name;
  @Input() categorias;
 
  tipo_archivo: string;

  categoria: number;
  nombre_capa: string;

  button_class: string;

  convertReady: boolean;
  archivoConvertidoGeojson: any;

  loading: boolean;

  constructor(public activeModal: NgbActiveModal, private capasService: CapasService) {}

  ngOnInit(){

  	this.categoria = 0;
  	this.nombre_capa = "";
  	this.convertReady = false;
  	this.tipo_archivo = "";
  	this.button_class = "btn btn-outline-default";
  }

	clickFileInput(){

		document.getElementById("geofile").click();
	}


	  importarGeojson(){

		let objeto = {
			"nombre": this.nombre_capa,
			"categoria": this.categoria,
			"data": this.archivoConvertidoGeojson
		}

		let i = 0;
		let pass = true;
		let previousLayer = undefined;
		let claseGeometry = 0;
		let claseGeometryPrevia = 0;

		console.log(objeto);

		objeto.data.features.forEach((element) =>{
			
			if(element){

				let clase;

				if(element.geometry.type == "Point" || element.geometry.type == "MultiPoint"){clase = 1}
				else if(element.geometry.type == "LineString" || element.geometry.type == "MultiLineString"){clase = 2}
				else if(element.geometry.type == "Polygon" || element.geometry.type == "MultiPolygon"){clase = 3}
				else {
					console.log("Geometria no reconocida");
					return false;
				}

				if(i!=0){

					if(clase != claseGeometryPrevia){
						pass = false;
						console.log("Antes: "+previousLayer.geometry.type);
						console.log("Ahora: "+element.geometry.type);
					}
				}
				else{
					console.log(element.geometry.type);
				}

				previousLayer = element;
				claseGeometryPrevia = clase;
				console.log(element); 
				i++;
			}
		});

		if(pass){


			for(let i = 1, j = objeto.data.features.length; i<j; i++){

				if(objeto.data.features[i].geometry.type != objeto.data.features[i-1].geometry.type){
					pass = false;
				}
			}

			console.log("Paso?: ");
			console.log(pass);

			if(!pass){


				for (let i = 0, j = objeto.data.features.length; i<j; i++){

					if(objeto.data.features[i].geometry.type == "Point"){
						console.log("De punto a multipunto");
						objeto.data.features[i].geometry.type = "MultiPoint";
						objeto.data.features[i].geometry.coordinates = [objeto.data.features[i].geometry.coordinates];
					}
					if(objeto.data.features[i].geometry.type == "LineString"){
						console.log("De linea a multilinea");
						objeto.data.features[i].geometry.coordinates = [objeto.data.features[i].geometry.coordinates];
						objeto.data.features[i].geometry.type = "MultiLineString";
					}
					if(objeto.data.features[i].geometry.type == "Polygon"){
						console.log("De poligono a multipoligono");
						objeto.data.features[i].geometry.type = "MultiPolygon";
						objeto.data.features[i].geometry.coordinates = [objeto.data.features[i].geometry.coordinates];
					}

				}
			}

		}
		else{
			return false;
		}


		console.log("Me lo lleve...");
		console.log(objeto);

		window["archivoConvertidoGeojson"] = objeto.data;

		objeto.data = JSON.stringify(objeto.data);

	    this.loading = true;
	    this.capasService.importar(objeto).subscribe(data =>{
	    this.loading = false;

		    console.log("Ya volvi...")

	        if(data.status == 200){     

	        	try{

	        		window["archivoConvertidoGeojson"] = data.body;
					document.getElementById("previsualizarCapa").click();
	        	}
	        	catch(err){

	        		console.log(err)
	        	}
	        }
	        else{

	          console.log(data);
	        }
	      },
	      error => {

		    this.loading = false;
	        console.log(error);
	      }
	    );


	  }

	checkFlag(capas) {

		let imp = this;

		let propiedades = Object.getOwnPropertyNames(capas._layers);

		if(!propiedades.length) {
			console.log("MAL");
			setTimeout(()=>{imp.checkFlag(capas)}, 1000);
		}
		
		else {
			console.log("BIEN AL FIN!");	
			imp.archivoConvertidoGeojson = {
				"type": "FeatureCollection",
				"features": []
			}
							
			for (let prop in capas._layers){

				imp.archivoConvertidoGeojson.features.push(capas._layers[prop].feature);
			}

			imp.button_class = "btn btn-outline-success";	
		}
	}

	cargarArchivo(ev){

		let archivos = ev.target.files;
		let imp = this;

		switch(this.tipo_archivo){

			case "zip":

				let shpfr = new FileReader();

				shpfr.addEventListener("load", (e)=>{

					let arrayBuffer = (e.target["result"]);

					window["shp"](arrayBuffer).then(function(geojson){

						window["archivoConvertidoGeojson"] = geojson;
						imp.archivoConvertidoGeojson = geojson;
						imp.button_class = "btn btn-outline-success";
					});

				}, false);

			    shpfr.readAsArrayBuffer(archivos[0]);
				console.log(archivos);
			break;

			case "csv":

				let csvfr = new FileReader();

				csvfr.addEventListener("load", (e)=>{

					let csvDataURL = (e.target["result"]);

					window["excelURL"] = csvDataURL;


					let capas = window["omnivore"].csv(csvDataURL);

					imp.archivoConvertidoGeojson = {
						"type": "FeatureCollection",
						"features": []
					};

					imp.checkFlag(capas);

				}, false);

				csvfr.readAsDataURL(archivos[0]);

			break;

			case "kml":

				let kmlfr = new FileReader();

				kmlfr.addEventListener("load", (e)=>{

					let kmlDataURL = (e.target["result"]);

					let capas = window["omnivore"].kml(kmlDataURL);

					imp.archivoConvertidoGeojson = {
						"type": "FeatureCollection",
						"features": []
					};

					capas._layers.forEach((element) =>{
						imp.archivoConvertidoGeojson.features.push(element.feature);
					});

					imp.button_class = "btn btn-outline-success";

				}, false);

				kmlfr.readAsDataURL(archivos[0]);

			break;

			case "gpx":

				let gpxfr = new FileReader();

				gpxfr.addEventListener("load", (e)=>{

					let gpxDataURL = (e.target["result"]);

					let capas = window["omnivore"].gpx(gpxDataURL);


					imp.archivoConvertidoGeojson = {
						"type": "FeatureCollection",
						"features": []
					};

					capas._layers.forEach((element) =>{
						imp.archivoConvertidoGeojson.features.push(element.feature);
					});

					imp.button_class = "btn btn-outline-success";


				}, false);				

				gpxfr.readAsDataURL(archivos[0]);

			break;

			case "wkt":

				let wktfr = new FileReader();

				wktfr.addEventListener("load", (e)=>{

					let wktDataURL = (e.target["result"]);

					let capas = window["omnivore"].wkt(wktDataURL);

					imp.archivoConvertidoGeojson = {
						"type": "FeatureCollection",
						"features": []
					};

					capas._layers.forEach((element) =>{
						imp.archivoConvertidoGeojson.features.push(element.feature);
					});

					imp.button_class = "btn btn-outline-success";

				}, false);				

				wktfr.readAsDataURL(archivos[0]);

			break;

			case "topojson":

				let topojsonfr = new FileReader();

				topojsonfr.addEventListener("load", (e)=>{

					let topojsonDataURL = (e.target["result"]);

					let capas = window["omnivore"].topojson(topojsonDataURL);

					imp.archivoConvertidoGeojson = {
						"type": "FeatureCollection",
						"features": []
					};

					capas._layers.forEach((element) =>{
						imp.archivoConvertidoGeojson.features.push(element.feature);
					});

					imp.button_class = "btn btn-outline-success";

				}, false);

				topojsonfr.readAsDataURL(archivos[0]);

			break;

			case "geojson":

				let geojsonfr = new FileReader();

				geojsonfr.addEventListener("load", (e)=>{

					let geojsonText = (e.target["result"]);

					let capas = JSON.parse(geojsonText);

					imp.archivoConvertidoGeojson = capas;

					imp.button_class = "btn btn-outline-success";

				}, false);

				geojsonfr.readAsText(archivos[0]);


			break;
		}

	}

}

@Component({
  selector: 'app-importar-capas',
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.css']
})
export class ImportarCapasComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  @Input() categorias;

  ngOnInit(){

  }

  open() {
    const modalRef = this.modalService.open(ImportarCapasContent);
    modalRef.componentInstance.name = 'Benjamin';
    modalRef.componentInstance.categorias = this.categorias;
  }
}
