import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { CapasService } from '../../services/capas/capas.service';
import { FlashMessagesService } from 'angular2-flash-messages';

//import * as L from 'leaflet';

import * as Turf from '@turf/turf';
import * as leafletImage from 'leaflet-image';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit, OnDestroy {

  activeMap: any;

  baseMaps: any;
  overlayMaps: any;
  colorOverlayMaps: any;
  control: any;

  geoJsons: any;

  agregarDatosActivado: boolean;
  editarDatosActivado: boolean;
  eliminarDatosActivado: boolean;


  capas: any;
  categorias: any;


  loading: boolean;

  geojsonEditable: any;
  geojsonVertices: any;
  geojsonCamino: any;
  geojsonFigura: any;
  puntosEnEdicion: any;
  verticesEnEdicion: any;
  caminoEnEdicion: any;
  figuraEnEdicion: any;

  moviendoVertice: boolean;
  verticeEnMovimiento: any;
  caminoCerrado: boolean;

  popupOpened: boolean;
  insertandoVertice: boolean;

  capasActivas: any;
  categoriaActiva: any;

  capaShapefile: any;

  layerToFilter: string;
  attributesToFilter: any;
  atributoFiltrado: string;
  atributoElegido: any;
  filtroElegido: any;

  valorBusqueda: string;
  
  fotoControl: any;
  filterControl: any;
  filterControl2: any;
  searchControl: any;
  medirDistanciaControl: any;
  medirAreaControl: any;
  irCentroControl: any;
  searchPoint: any;

  marcadorBusqueda: any;
  colocandoPersona: boolean;
  personaPorColocar: boolean;
  
  medidaDistancia: number;
  medidaArea: number;

	latkm: number;
	lngkm: number;

	controlAbajo: boolean;

	interaccionCortada: boolean;

	dibujandoPunto: boolean;
	dibujandoCamino: boolean;
	dibujandoPoligono: boolean;
	datosIconHovered: string;
	datosHovered: string;
	filterHovered: boolean;
	pointHovered: boolean;
	distanceHovered: boolean;
	areaHovered: boolean;
	unidadDistancia: string;
	unidadPerimetro: string;
	unidadArea: string;

	claseBotonFiltro: string;

	foto: any;
	fotoDibujada: boolean;

	capasGeo: any;


  constructor(
  			private flashMessage: FlashMessagesService,
  			private categoriasService: CategoriasService,
  			private capasService: CapasService,
  			private modalService: NgbModal) { }

  ngOnInit() {

  	this.limpiarLocalStorage();

  	this.capasGeo = {
  		comun: [
	  		{usado: false, nombre: "punto_geotecnia_1.png"},
	  		{usado: false, nombre: "punto_geotecnia_2.png"},
	  		{usado: false, nombre: "punto_geotecnia_3.png"},
	  		{usado: false, nombre: "punto_geotecnia_4.png"},
	  		{usado: false, nombre: "punto_geotecnia_5.png"}
  		],
  		bid: [
  			{usado: false, nombre: "punto_geotecnia_bid_1.png"}
  		],
  		camudoca: [
  			{usado: false, nombre: "punto_geotecnia_camudoca_1.png"},
  			{usado: false, nombre: "punto_geotecnia_camudoca_2.png"},
  			{usado: false, nombre: "punto_geotecnia_camudoca_3.png"},
  			{usado: false, nombre: "punto_geotecnia_camudoca_4.png"},
  			{usado: false, nombre: "punto_geotecnia_camudoca_5.png"}
  		],
  		pdvsa: [
  			{usado: false, nombre: "fondopuntopdvsa.png"}
  		]
  	}

	this.claseBotonFiltro = "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin";

  	this.unidadDistancia = "Km";
  	this.unidadArea = "Km2";
  	this.unidadPerimetro = "Km";

  	this.interaccionCortada = false;

  	this.controlAbajo = false;
  	console.log("Control: "+this.controlAbajo);
    var polygon = Turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
    var area = Turf.area(polygon);

    console.log(area);

  this.latkm = this.getKilometros(0,0,1,0);
  this.lngkm = this.getKilometros(0,0,0,1);

	this.medidaDistancia = 0;
	this.medidaArea = 0;
	
	this.medirDistanciaControl = {};
	this.medirAreaControl = {};

	this.colocandoPersona = false;
	this.personaPorColocar = false;
  	
  	this.searchPoint = {
  		"lng": 0,
  		"lat": 0,
  		"radius": 1,
  		"area": 0
  	};

  	this.categoriaActiva = "";

  	this.layerToFilter = "";
  	this.attributesToFilter = [];
  	this.atributoFiltrado = "";
  	this.atributoElegido = {
  		"nombre": "",
  		"tipo": ""
  	};

  	this.valorBusqueda = "";
  	this.filtroElegido = "";

  	this.capasActivas = [];

  	this.insertandoVertice = false;

  	this.caminoCerrado = false;

  	this.popupOpened = false;

  	this.control = [];
  	this.baseMaps = {};
  	this.overlayMaps = {};
  	this.colorOverlayMaps = [];
  	this.geoJsons = [];

  	this.inicializarGeojsons();

	if(window.localStorage.capaActiva){
		window.localStorage.removeItem("capaActiva");
	}
	if(window.localStorage.coordenadas){
		window.localStorage.removeItem("coordenadas");
	}

  	this.loading = false;

	this.flashMessage.show('Bienvenido!', { cssClass: 'alert-success', timeout: 3000 });

    eval("window.yo = this");

  	this.agregarDatosActivado = false;
  	this.editarDatosActivado = false;
  	this.eliminarDatosActivado = false;

  	this.loading = true;
	this.categoriasService.obtener().subscribe(data =>{
  	this.loading = false;

		if(data.status == 200){			
			this.categorias = data.body;
			window.localStorage.categorias = JSON.stringify(this.categorias);
		}
		else{
		  	this.categorias = [];
		}
	},
		error => {
	  		
	  		this.loading = false;
			console.log(error);
		}
	);


  	this.loading = true;
	this.capasService.obtener().subscribe(data =>{
  	this.loading = false;

		if(data.status == 200){
			this.capas = data.body;

			console.log(this.capas);

			this.capas.forEach((element) =>{

				if(!element.categoria){
					element.categoria = {
						nombre: "N/A",
						id: ""
					}
				}

				element.geometria = element.tipo;

			});

			window.localStorage.capas = JSON.stringify(this.capas);
		}
		else{
		  	this.capas = [];
		}
	},
		error => {

		  	this.loading = false;
			console.log(error);
		}
	);



	this.initDraw();
  	document.getElementById("montar").click();


	eval("window.yo = this");
  }

  ngOnDestroy(){

  	this.limpiarLocalStorage();
  }


  limpiarLocalStorage(){


  	if(window.localStorage.lastLayer){
	  	window.localStorage.removeItem("lastLayer");
  	}

	if(window.localStorage.capaActiva){
		window.localStorage.removeItem("capaActiva");
	}

	if(window.localStorage.coordenadas){
		window.localStorage.removeItem("coordenadas");
	}

	if(window.localStorage.capas){
		window.localStorage.removeItem("capas");
	}

	if(window.localStorage.categorias){
		window.localStorage.removeItem("categorias");
	}

	if(window.localStorage.capasActivas){
		window.localStorage.removeItem("capasActivas");
	}

  }


  initDraw(){


	let osmUrl='http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	let cartoUrl='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

	const osm = window["L"].tileLayer(osmUrl, {
	    attribution: 'Open Street Maps | CSUDO'
	});

	const carto = window["L"].tileLayer(cartoUrl, {
	    attribution: 'Carto Tiles | CSUDO'
	});

      const satelite_provider = window["L"].tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Satelital | CSUDO'
      });

	this.activeMap = window["L"].map('mapid', {
		center: [10.4263649457595, -64.149649060059],
		zoom: 13,
		zoomControl: false,
		layers: [osm],
		preferCanvas: true,
		renderer: window["L"].canvas()
	});


	this.configurarControlCentro();

	//this.configurarControlDatos();

	this.configurarControlFoto();

	this.baseMaps = {
	    "OSM": osm,
	    "Carto": carto,
		"Satelite": satelite_provider
	};

	this.overlayMaps = {

	};

	this.control = window["L"].control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	this.control.setPosition('topleft');


	window["L"].control.zoom().addTo(this.activeMap);

	this.activeMap.on("click", (ev) =>{

		if(this.interaccionCortada) return false;

		if(this.colocandoPersona){

			this.personaPorColocar = false;			
			this.searchPoint.lat = ev.latlng.lat;
			this.searchPoint.lng = ev.latlng.lng;
			this.encontrarPunto();
		}

		if(this.personaPorColocar){
			
			this.colocandoPersona = true;
		}

		else{

			if(window.localStorage.capaActiva){

				if(!this.insertandoVertice){
		
					if(!this.popupOpened && !this.moviendoVertice){
		
						if(!this.caminoCerrado){
		
							if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
							if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
						}
						this.addPointToArr(ev.latlng.lng, ev.latlng.lat);
					}
					if(this.moviendoVertice){
						this.moverVertice(ev.latlng, 2);
					}
				}				
				
			}
			
		}

	});

	this.activeMap.on("popupopen", (ev) =>{

		this.popupOpened = true;
	});	

	this.activeMap.on("popupclose", (ev) =>{

		this.popupOpened = false;
	});

	this.activeMap.scrollWheelZoom.disable()
	
	let init = this;


	window.addEventListener("keydown", function(e){

		if(e.keyCode == 16){
			init.activeMap.scrollWheelZoom.enable()
		}

		if(e.keyCode == 17){
			init.controlAbajo = true;
		  	console.log("Control: "+init.controlAbajo);
		}

	});

	window.addEventListener("keyup", function(e){

		if(e.keyCode == 16){
			init.activeMap.scrollWheelZoom.disable()
		}

		if(e.keyCode == 17){
			init.controlAbajo = false;
		  	console.log("Control: "+init.controlAbajo);
		}

	});
	
	//this.configurarControlFiltro2();
	//this.configurarControlDistancia();
	//this.configurarControlArea();
	//this.configurarControlBusqueda();
//	this.configurarControlFiltro();
  }

shout(mensaje, estilo, tiempo){
	this.flashMessage.show(mensaje, { cssClass: estilo, timeout: tiempo });
}

calcularAreaPunto(){

  	this.searchPoint.area = Math.PI*(this.searchPoint.radius*this.searchPoint.radius);
  }

  inicializarGeojsons(){

  	this.geojsonEditable = {
	  "type": "Feature",
	  "geometry": {
	    "type": "",
	    "coordinates": []
	  },
	  "properties": {
	  }
	}  	

	this.geojsonVertices = {
	  "type": "FeatureCollection",
	  "features": []
	}  	

	this.geojsonCamino = {
	  "type": "FeatureCollection",
	  "features": []
	}	

	this.geojsonFigura = {
	  "type": "Feature",
	  "geometry": {
	    "type": "Polygon",
	    "coordinates": []
	  },
	  "properties": {
	  }
	}

  }

  limpiarEditables(){

  	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
  	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  	if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);

  }
  
	getKilometros(lat1,lon1,lat2,lon2){
		
		var rad = function(x) {return x*Math.PI/180;}
		var R = 6378.137; //Radio de la tierra en km
		var dLat = rad( lat2 - lat1 );
		var dLong = rad( lon2 - lon1 );
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		return d; //Retorna tres decimales
	}
  
	medirCaminoDibujado(){

		let init = this;

		this.dibujandoCamino = true;
		this.dibujandoPoligono = false;
		this.dibujandoPunto = false;

		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([])
		this.medidaDistancia = 0;
		this.medidaArea = 0;

		setTimeout(()=>{
			
			init.flashMessage.show('Comience a dibujar el camino', { cssClass: 'alert-info', timeout: 4000 });
			window.localStorage.capaActiva = JSON.stringify({'tipo': 'LineString','geometria': 'LineString', 'coordenadas':[]});
		}, 500)
		
	}
	
	medirCaminoElegido(){

		
	}
	
	medirAreaDibujada(){

		let init = this;

		this.dibujandoCamino = false;
		this.dibujandoPoligono = true;
		this.dibujandoPunto = false;

		
		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([[]])
		this.medidaDistancia = 0;
		this.medidaArea = 0;

		setTimeout(()=>{
			
			init.flashMessage.show('Comience a dibujar el poligono', { cssClass: 'alert-info', timeout: 4000 });
			window.localStorage.capaActiva = JSON.stringify({'tipo': 'Polygon', 'geometria': 'Polygon', 'coordenadas':[[]]});
		}, 500)
		
		
	}
	
	medirAreaElegida(){

		


		
	}

	prevenirInteraccion(el){
		
		if(el == 'd'){
			this.distanceHovered = true;
		}		
		if(el == 'a'){
			this.areaHovered = true;
		}
		if(el == 'p'){
			this.pointHovered = true;
		}		
		if(el == 'f'){
			this.filterHovered = true;
		}
		if(el == 'i'){
			let a = document.querySelectorAll("#formularioDatos>div")
			a[0]["style"]="display: none;" 
			a[1]["style"]="display: block;" 
		}
		if(el == 'pic'){
			let a = document.querySelectorAll("#formularioFoto>div")
			a[0]["style"]="display: none;" 
			a[1]["style"]="display: block;" 
		}

		console.log("Cortando...");
		this.interaccionCortada = true;
		this.activeMap.dragging.disable();
		this.activeMap.doubleClickZoom.disable();
	}
	
	permitirInteraccion(el){

		if(el == 'd'){
			this.distanceHovered = false;
		}		
		if(el == 'a'){
			this.areaHovered = false;
		}
		if(el == 'p'){
			this.pointHovered = false;
		}
		if(el == 'f'){
			this.filterHovered = false;
		}		
		if(el == 'i'){
			let a = document.querySelectorAll("#formularioDatos>div")
			a[0]["style"]="display: block;" 
			a[1]["style"]="display: none;" 
		}
		if(el == 'pic'){
			let a = document.querySelectorAll("#formularioFoto>div")
			a[0]["style"]="display: block;" 
			a[1]["style"]="display: none;" 
		}

		console.log("Reactivando...");
		this.interaccionCortada = false;
		this.activeMap.dragging.enable();
		this.activeMap.doubleClickZoom.enable();
	}

	limpiarPunto(){

		this.dibujandoPunto = false;		
		if(this.marcadorBusqueda) this.activeMap.removeLayer(this.marcadorBusqueda);	
	}

	limpiarPoligono(){

		this.dibujandoPoligono = false;		
		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
		if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);

		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([[]])
		this.medidaDistancia = 0;
		this.medidaArea = 0;
	}

	limpiarCamino(){

		this.dibujandoCamino = false;
		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

		this.inicializarGeojsons();
		this.limpiarEditables();
		window.localStorage.coordenadas = JSON.stringify([])
		this.medidaDistancia = 0;
		this.medidaArea = 0;
	}

	obtenerPunto(){

		this.dibujandoCamino = false;
		this.dibujandoPoligono = false;
		this.dibujandoPunto = true;

		this.personaPorColocar = true;
		this.flashMessage.show('Haga click en el mapa para obtener las coordenadas', { cssClass: 'alert-info', timeout: 4000 });
	}
	
	encontrarPunto(){

		let init = this;

		this.dibujandoCamino = false;
		this.dibujandoPoligono = false;
		this.dibujandoPunto = true;


		if(this.marcadorBusqueda) this.activeMap.removeLayer(this.marcadorBusqueda);
		this.colocandoPersona = false;

		console.log("break 1");
		this.activeMap.setView([this.searchPoint.lat, this.searchPoint.lng]);

		this.calcularAreaPunto();

		let popupDiv = document.createElement("div");
		let boton = document.createElement("button");
		boton.setAttribute("class","btn btn-danger");
		boton.innerHTML='<i class="fa fa-times" aria-hidden="true"></i>';
		boton.addEventListener("click", function(){

			init.dibujandoPunto = false;			
			init.activeMap.removeLayer(init.marcadorBusqueda);
		});
		popupDiv.appendChild(boton);

		console.log("break 2");
		this.marcadorBusqueda = window["L"].circle([this.searchPoint.lat, this.searchPoint.lng],{
		    color: 'red',
		    fillColor: '#f03',
		    fillOpacity: 0.5,
		    radius: this.searchPoint.radius
		}).bindPopup(popupDiv).addTo(this.activeMap);
	}

	

	toggleFilter(){
		
		if(this.capasActivas.length==0){
			this.shout("No ha cargado ninguna capa que pueda filtrar aun", "alert-warning", 3000);
			return false;
		}
		
		if(this.claseBotonFiltro == "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin"){
			this.claseBotonFiltro = "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin";
			document.getElementById("modalFiltro").click();
		}
		else{
			this.claseBotonFiltro = "leaflet-control-layers leaflet-control leaflet-control-layers-expanded nomargin";
		}
	}

	limpiarFormularioFiltro(){

		this.valorBusqueda = "";
		this.filtroElegido = "";
		this.atributoFiltrado = "";
		this.layerToFilter = "";

	}


  configurarControlFiltro(){
  	
///INICIO CONTROL
	
	let init = this;
	
	window["L"].Control["Filtro"] = window["L"].Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioFiltro");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["filtro"] = function(id, options) {
	  return new window["L"].Control["Filtro"](id, options);
	}

	var items = [];

	this.filterControl = window["L"].control["filtro"]({
	  data: items
	}).addTo(this.activeMap);
	
  }  

  configurarControlFiltro2(){
  	
///INICIO CONTROL
	
	let init = this;
	
	window["L"].Control["Filtro2"] = window["L"].Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioFiltro2");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["filtro2"] = function(id, options) {
	  return new window["L"].Control["Filtro2"](id, options);
	}

	var items = [];

	this.filterControl2 = window["L"].control["filtro2"]({
	  data: items
	}).addTo(this.activeMap);
	
  }  


  configurarControlDatos(){
  	
///INICIO CONTROL
	
	let init = this;
	
	window["L"].Control["Datos"] = window["L"].Control.extend({
  options: {

    position: 'topleft'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioDatos");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["datos"] = function(id, options) {
	  return new window["L"].Control["Datos"](id, options);
	}

	var items = [];

	this.filterControl2 = window["L"].control["datos"]({
	  data: items
	}).addTo(this.activeMap);
	
  }

  configurarControlFoto(){
  	
///INICIO CONTROL
	
	let init = this;
	
	window["L"].Control["Foto"] = window["L"].Control.extend({
  options: {

    position: 'topleft'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioFoto");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["foto"] = function(id, options) {
	  return new window["L"].Control["Foto"](id, options);
	}

	var items = [];

	this.fotoControl = window["L"].control["foto"]({
	  data: items
	}).addTo(this.activeMap);
	
  }

  
  configurarControlBusqueda(){
  	
///INICIO CONTROL
	
	let init = this;
	
	window["L"].Control["Search"] = window["L"].Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioPunto");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["search"] = function(id, options) {
	  return new window["L"].Control["Search"](id, options);
	}

	var items = [];

	this.searchControl = window["L"].control["search"]({
	  data: items
	}).addTo(this.activeMap);
	
  }  
  
  configurarControlDistancia(){
  	
///INICIO CONTROL
	

	window["L"].Control["MedirDistancia"] = window["L"].Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioDistancia");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["medirDistancia"] = function(id, options) {
	  return new window["L"].Control["MedirDistancia"](id, options);
	}

	var items = [];

	this.medirDistanciaControl = window["L"].control["medirDistancia"]({
	  data: items
	}).addTo(this.activeMap);
	
  }
  
  configurarControlArea(){
  	
///INICIO CONTROL
	

	window["L"].Control["MedirArea"] = window["L"].Control.extend({
  options: {

    position: 'topright'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioArea");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["medirArea"] = function(id, options) {
	  return new window["L"].Control["MedirArea"](id, options);
	}

	var items = [];

	this.medirAreaControl = window["L"].control["medirArea"]({
	  data: items
	}).addTo(this.activeMap);
	
  }

  configurarControlCentro(){
  	
///INICIO CONTROL
	

	window["L"].Control["IrCentro"] = window["L"].Control.extend({
  options: {

    position: 'topleft'
  },
  initialize: function (options) {

    window["L"].Util.setOptions(this, options);
  },
  onAdd: function (map) {

    this.form = document.getElementById("formularioHome");
    return this.form;
  },
  onRemove: function (map) {
    // when removed
  },
  submit: function(e) {
    window["L"].DomEvent.preventDefault(e);
  }
});


///FIN CONTROL

	window["L"].control["irCentro"] = function(id, options) {
	  return new window["L"].Control["IrCentro"](id, options);
	}

	var items = [];

	this.irCentroControl = window["L"].control["irCentro"]({
	  data: items
	}).addTo(this.activeMap);
	
  }

  estiloEdicion(){

  	let estilo = "";

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);

  	
  	if(coordenadas.length > 1){

  		if((coordenadas[0][0] == coordenadas[0][1])&&(coordenadas[coordenadas.length-1][0] == coordenadas[coordenadas.length-1][1])){
  			estilo = "Polygon";
  		}
  		else{
  			estilo = "LineString";
  		}
  	}
	else{
  		estilo = "Point";
  	}

  	if(estilo == "Point"){

		return {
			radius: 8,
			fillColor: "#ff7800",
			color: "#000",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.8
		}
  	}
  	else if(estilo == "LineString"){
  	
		return {
			"color": '#08519c',
			"weight": 5,
			"opacity": 0.65
		}  	
	}
  	else if(estilo == "Polygon"){

		return { 
			fillColor: '#bdd7e7',
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		}
  	}

  }

  addPointToArr(lng, lat){

  	let tipo = "";
	let coordenadas = [];


  	if(window.localStorage.capaActiva){

  		let capa = JSON.parse(window.localStorage.capaActiva);
  		this.geojsonEditable.geometry.type = capa.geometria;

	  	tipo = JSON.parse(window.localStorage.capaActiva).geometria;

	  	if(window.localStorage.coordenadas){

	  		coordenadas = JSON.parse(window.localStorage.coordenadas);

			let init = this;

	  		switch(tipo){

	  			case "Point":
				  	
				  	coordenadas = [lng, lat];
			  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
					
			  		this.geojsonEditable.geometry.coordinates = coordenadas;

					if(this.puntosEnEdicion){
						this.activeMap.removeLayer(this.puntosEnEdicion);
					}

					this.puntosEnEdicion = window["L"].geoJSON(this.geojsonEditable, {
						pointToLayer: function (feature, latlng) {
				        	return window["L"].circleMarker(latlng, {
										radius: 8,
										fillColor: "#ff7800",
										color: "#000",
										weight: 1,
										opacity: 1,
										fillOpacity: 0.8
									});
				    	}}).addTo(this.activeMap);

	  			break;

	  			case "LineString":

			  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
			  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

					coordenadas.push([lng, lat]);

				    if(coordenadas.length>1){
				    	this.levantarCamino(coordenadas);
				    }

				    this.levantarVertices(tipo, coordenadas);

		  			window.localStorage.coordenadas = JSON.stringify(coordenadas);

	  			break;

	  			case "Polygon":

	  				if(!this.caminoCerrado){

				  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
				  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);


						coordenadas[0].push([lng, lat]);

					    if(coordenadas[0].length>1){
					    	this.levantarCamino(coordenadas[0]);
					    }

					    this.levantarVertices(tipo, coordenadas);

			  			window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  				}

	  			break;
	  		}


	  	}
	  	else{

	  		console.log("No habia coordenadas");
	  		if(tipo == 'LineString'){coordenadas.push([lng, lat]);}
	  		if(tipo == 'Point'){coordenadas.push([]);coordenadas[0].push([lng, lat])}
	  		if(tipo == 'Polygon'){coordenadas.push([]);coordenadas[0].push([lng, lat])}
	  		console.log(coordenadas);
	  		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	  	}

  	}
  	else{

  		console.log("No hay capa activa");
  		return false;
  	}

  }

  levantarCamino(coordenadas){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);

	this.geojsonCamino.features = [];
	this.medidaDistancia = 0;

	console.log(coordenadas);
  	for(let i = 0, j = coordenadas.length; i<j-1; i++){

		let camino = {
			"type": "Feature",
			"geometry": {
				"type": "LineString",
				"coordinates": [coordenadas[i], coordenadas[i+1]]
			},
			"properties": {}
		}

		this.geojsonCamino.features.push(camino);
  	}
/*
		this.caminoEnEdicion = window["L"].geoJSON(this.geojsonCamino, {style: {
			"color": '#FFFF00',
			"weight": 2,
			"opacity": 0.65
			}
		}).addTo(this.activeMap);
*/
		this.caminoEnEdicion = window["L"].geoJSON(this.geojsonCamino, {style: this.estiloEdicion}).addTo(this.activeMap);

		let init = this;

		this.caminoEnEdicion.eachLayer((layer) =>{
				 				
			
			layer.on("preclick", (ev)=>{
				
				if(window.localStorage.capaActiva && !init.controlAbajo){
					init.insertandoVertice = true;
					init.insertarVertice(ev);					
				}

			});
			let coords = layer.feature.geometry.coordinates;
			//let km = init.getKilometros(coords[0][0],coords[0][1],coords[1][0],coords[1][1]);
			let from = Turf.point([coords[0][0],coords[0][1]]);
			let to = Turf.point([coords[1][0],coords[1][1]]);
			let options = {units: 'Kilometers'};
			let km = Turf.distance(from, to, {units: 'kilometers'});
			layer.bindPopup("Distancia (Km.): "+km);
			init.medidaDistancia = init.medidaDistancia+km;
			console.log(km);
			console.log(init.medidaDistancia);
		});



  }

  insertarVertice(evento){

  	console.log("insertandoVertice");

  	let tipo = JSON.parse(window.localStorage.capaActiva).tipo;
  	let origen = evento.target.feature.geometry.coordinates[0];
  	let destino = [evento.latlng.lng, evento.latlng.lat]
  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let coords;
  	let punto;
  	let coordenadasNuevas = [];

  	console.log(coordenadas);
  	console.log(tipo);

  	this.activeMap.removeLayer(this.caminoEnEdicion);
  	this.activeMap.removeLayer(this.verticesEnEdicion);

  	if(tipo == "LineString"){
		
		coords = coordenadas;
		punto = coords.findIndex((element) =>{return (element[0] == origen[0])&&(element[1] == origen[1])});

	  	for(let i = 0, j = coords.length; i<j; i++){

	  		if(i == punto+1){
	  			coordenadasNuevas.push(destino);
	  		}
	  			coordenadasNuevas.push(coords[i]);  			
	  	}

		coordenadas = coordenadasNuevas;
		this.levantarCamino(coordenadas);
		this.levantarVertices(tipo, coordenadas);
  	}

  	if(tipo == "Polygon"){

		coords = coordenadas[0];
		console.log("Poligono");
		console.log(coords);
		punto = coords.findIndex((element) =>{return (element[0] == origen[0])&&(element[1] == origen[1])});

	  	for(let i = 0, j = coords.length; i<j; i++){

	  		if(i == punto+1){
	  			coordenadasNuevas.push(destino);
	  		}
	  			coordenadasNuevas.push(coords[i]);
	  			console.log(coordenadasNuevas);
	  	}

		coordenadas = [coordenadasNuevas];
		this.levantarCamino(coordenadas[0]);
		this.levantarVertices(tipo, coordenadas);
  	}



  	window.localStorage.coordenadas = JSON.stringify(coordenadas);

  	let init = this;
  	setTimeout(()=> {init.insertandoVertice = false;}, 500);
  }

  levantarVertices(tipo, coordenadas){


  	let init = this;
  	let coords;

  	if(tipo == "LineString"){coords = coordenadas}
  	if(tipo == "Polygon"){coords = coordenadas[0]}

	console.log("añadiendo normalito");

	this.geojsonVertices.features = [];
	  		
	console.log(coordenadas);
	console.log(coords);
	
	coords.forEach((element) =>{

		let vertice = {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": element
			},
			"properties": {}
		}

		this.geojsonVertices.features.push(vertice);
	});
	



	this.verticesEnEdicion = window["L"].geoJSON(this.geojsonVertices, {
			
			pointToLayer: function (feature, latlng) {
				return window["L"].circleMarker(latlng, {
					radius: 6,
					fillColor: "#FF0000",
					color: "#FFFF00",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.6 });
			}}).addTo(this.activeMap);

	let i = 0;

	this.verticesEnEdicion.eachLayer((layer) =>{ 
							
		i++;

		layer.on("preclick", (ev)=>{
			this.popupOpened = true;
		});

		let div = document.createElement("div");

		let buttonMove = document.createElement("button");
		buttonMove.setAttribute("class","btn btn-outline-warning");
		buttonMove.innerHTML='<i class="fa fa-crosshairs" aria-hidden="true"></i>'
		buttonMove.addEventListener("click", function(){
			window.localStorage.geometria = tipo;
			init.moverVertice(layer._latlng, 1);
		}, false);


		let buttonDelete = document.createElement("button");
		buttonDelete.setAttribute("class","btn btn-outline-danger");
		buttonDelete.innerHTML='<i class="fa fa-close" aria-hidden="true"></i>'
		buttonDelete.addEventListener("click", function(){
			init.quitarVertice(layer._latlng, tipo);
		}, false);


		div.appendChild(buttonMove);
		div.appendChild(buttonDelete);

		if(tipo == "Polygon" && coordenadas[0].length > 2 && !this.caminoCerrado){

			if( (i == 1 ) || (i == coordenadas[0].length)){
				let buttonClose = document.createElement("button");
				buttonClose.setAttribute("class","btn btn-outline-success");
				buttonClose.innerHTML='<i class="fa fa-lock" aria-hidden="true"></i>'
				buttonClose.addEventListener("click", function(){
					init.cerrarCamino(coordenadas);
				}, false);
				div.appendChild(buttonClose);
			}
			else{
				console.log("NO MATCH");
			}

		}
		
		if(i == 1 && !this.caminoCerrado && ( (tipo == "LineString" && coordenadas.length>1) || (tipo == "Polygon" && coordenadas[0].length>1) ) ){
			let buttonSetHead = document.createElement("button");
			buttonSetHead.setAttribute("class","btn btn-outline-primary");
			buttonSetHead.innerHTML='<i class="fa fa-flag" aria-hidden="true"></i>'
			buttonSetHead.addEventListener("click", function(){
				init.cambiarCabeza(tipo, coordenadas);
			}, false);
			div.appendChild(buttonSetHead);			
		}
		
		layer.bindPopup(div);

	});

  }

  cambiarCabeza(tipo, coordenadas){

  	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

  	let coordenadasNuevas = [];

  	if(tipo == "LineString"){

  		for(let i = 1, j = coordenadas.length; i<=j; i++){
  			coordenadasNuevas.push(coordenadas[j-i]);
  		}

		this.levantarCamino(coordenadasNuevas);
  	}
  	if(tipo == "Polygon"){

  		coordenadasNuevas.push([]);
  		for(let i = coordenadas[0].length-1; i>=0; i--){
  			coordenadasNuevas[0].push(coordenadas[0][i]);
  		}


		for(let i = 0, j = this.geojsonVertices.features.length; i<j; i++){
			
			console.log(this.geojsonVertices.features[i].geometry.coordinates);
			console.log(coordenadasNuevas[0][i]);

			this.geojsonVertices.features[i].geometry.coordinates = coordenadasNuevas[0][i];
		}

		this.levantarCamino(coordenadasNuevas[0]);
  	}
	window.localStorage.coordenadas = JSON.stringify(coordenadasNuevas);

	this.levantarVertices(tipo, coordenadasNuevas);
  }


  moverVertice(punto, stage){

  	if(stage === 1){

	  	this.activeMap.closePopup();

	  	if(this.verticeEnMovimiento){
	  		this.activeMap.removeLayer(this.verticeEnMovimiento);
	  	}

	  	this.moviendoVertice = true;

	  	window.localStorage.verticeNuevo = JSON.stringify(punto);

		this.verticeEnMovimiento = window["L"].circleMarker(punto, {
			radius: 6,
			fillColor: "#819FF7",
			color: "#00FF00",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4 
		}).addTo(this.activeMap);
	}
  	if(stage === 2){

  		let init = this;

  		this.activeMap.removeLayer(this.verticeEnMovimiento);

		this.verticeEnMovimiento = window["L"].circleMarker(punto, {
			radius: 6,
			fillColor: "#819FF7",
			color: "#00FF00",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4 
		}).addTo(this.activeMap);

		let boton = document.createElement("button");
		boton.setAttribute("class","btn btn-outline-success")
		boton.innerHTML='<i class="fa fa-crosshairs" aria-hidden="true"></i>'		
		boton.addEventListener("click", function(ev){

			init.moverVertice(punto, 3);
		}, false);

		let boton2 = document.createElement("button");
		boton2.setAttribute("class","btn btn-outline-danger")
		boton2.innerHTML='<i class="fa fa-close" aria-hidden="true"></i>'		
		boton2.addEventListener("click", function(ev){

	  		init.activeMap.removeLayer(init.verticeEnMovimiento);
		  	init.moviendoVertice = false;
		}, false);

		let div = document.createElement("div");
		div.appendChild(boton);
		div.appendChild(boton2);
		this.verticeEnMovimiento.bindPopup(div);

  	}
  	if(stage === 3){

  		let geometria = window.localStorage.geometria;

	  	this.moviendoVertice = false;

  		let origen = JSON.parse(window.localStorage.verticeNuevo);
  		let coordenadas = JSON.parse(window.localStorage.coordenadas);

  		this.activeMap.removeLayer(this.verticeEnMovimiento);

  		if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
  		if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

	  		this.geojsonVertices.features.forEach((element) =>{

	  			if(element.geometry.coordinates[0] == origen.lng && element.geometry.coordinates[1] == origen.lat){

	  				element.geometry.coordinates[0] = punto.lng;
	  				element.geometry.coordinates[1] = punto.lat;
	  			}
	  		});

  		if(geometria == "LineString"){
			
	  		
	  		coordenadas.forEach((element) =>{

	  			if(element[0] == origen.lng && element[1] == origen.lat){
					element[0] = punto.lng;
					element[1] = punto.lat;
	  			}
	  		});

	  		console.log(coordenadas);
	  		this.levantarCamino(coordenadas);
	  		this.levantarVertices("LineString", coordenadas);
  		}

  		if(geometria == "Polygon"){

	  		
	  		coordenadas[0].forEach((element) =>{

	  			if(element[0] == origen.lng && element[1] == origen.lat){
					element[0] = punto.lng;
					element[1] = punto.lat;
	  			}
	  		});

	  		this.levantarCamino(coordenadas[0]);
	  		this.levantarVertices("Polygon", coordenadas);

	  		if(this.caminoCerrado){

				this.cerrarCamino(coordenadas);
	  		} 
  		}

  		window.localStorage.coordenadas = JSON.stringify(coordenadas);


  	}


  }

  quitarVertice(latlng, tipo){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let coordenadasNuevas = [];

  	if(tipo == "LineString"){

	  	coordenadas.forEach((element) =>{
	  		if((element[0] != latlng.lng) && (element[1] != latlng.lat)) coordenadasNuevas.push(element);
	  	});

	  	this.levantarCamino(coordenadasNuevas);
  		this.levantarVertices(tipo, coordenadasNuevas);
  	}

  	if(tipo == "Polygon"){

  		coordenadasNuevas.push([]);

  		let pos = coordenadas[0].findIndex((element) =>{
  			return (element[0] == latlng.lng) && (element[1] == latlng.lat);
  		});

	  	if(this.caminoCerrado){

	  		console.log("EL camino estaba cerrado");
	  		console.log("Posicion: "+pos);

	  		this.activeMap.removeLayer(this.figuraEnEdicion);

	  		if(pos == 0){


		  		for(let i = 1; i < coordenadas[0].length-1; i++){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}

	  		}
	  		else{

		  		for(let i = pos-1; i > 0 ; i--){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}

		  		for(let i = coordenadas[0].length-1; i>pos; i--){

		  			coordenadasNuevas[0].push(coordenadas[0][i]);
		  		}
	  		}


	  		this.caminoCerrado = false;

	  	}
	  	else{

	  		console.log("EL camino NO estaba cerrado");

	  		coordenadasNuevas[0] = coordenadas[0].filter((element) =>{
	  			return (element[0] != latlng.lng) && (element[1] != latlng.lat);
	  		})
			console.log(coordenadasNuevas[0]);
	  	}

	  	this.levantarCamino(coordenadasNuevas[0]);
	  	this.levantarVertices(tipo, coordenadasNuevas);
  	}

  	window.localStorage.coordenadas = JSON.stringify(coordenadasNuevas);
  }

  cerrarCamino(coordenadas){

	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
	if(this.caminoCerrado) this.activeMap.removeLayer(this.figuraEnEdicion);



	if(coordenadas[0].length>2 && (coordenadas[0][0][0] != coordenadas[0][coordenadas[0].length-1][0]) && (coordenadas[0][0][1] != coordenadas[0][coordenadas[0].length-1][1])){
		
		console.log("acomodando el camino");
		coordenadas[0].push(coordenadas[0][0]);
		this.caminoCerrado = true;
	}

	let oldCoords = [[]];
	let i = 1;
	coordenadas[0].forEach((element) =>{

		if(i<coordenadas[0].length) oldCoords[0].push([element[0], element[1]]);
		i++;
	});

		window.localStorage.coordenadas = JSON.stringify(coordenadas);
	



	this.geojsonFigura.geometry.coordinates = coordenadas;
/*	
	this.figuraEnEdicion = window["L"].geoJSON(this.geojsonFigura, {style: {
										fillColor: '#bdd7e7',
									    weight: 2,
									    opacity: 1,
									    color: 'white',
									    dashArray: '3',
									    fillOpacity: 0.7} 
									}).addTo(this.activeMap);	
*/

	this.figuraEnEdicion = window["L"].geoJSON(this.geojsonFigura, {style: this.estiloEdicion}).addTo(this.activeMap);

	this.caminoCerrado = true;

	if(coordenadas[0].length>1){

		this.levantarCamino(coordenadas[0]);
	}
	/*
	let xlng = [];
	let ylat = [];
	
	for(let i = 0, j = coordenadas[0].length; i<j; i++){
		
		xlng.push(this.getKilometros(0,0,0,coordenadas[0][i][0]));
		ylat.push(this.getKilometros(0,0,coordenadas[0][i][1],0));
	}
	
	this.medidaArea = this.areaPoligono(coordenadas[0]);
	*/
	console.log("Coordenadas para turf...");
	console.log(coordenadas[0]);
	var poligono = Turf.polygon([coordenadas[0]]);
	this.medidaArea = (Turf.area(poligono)/1000000);
	console.log(coordenadas);
	console.log(oldCoords);
	this.levantarVertices('Polygon', oldCoords);

  }

	areaPoligono(coordenadas){

		var equises = [];
		var yeses = [];

		coordenadas.forEach((element) =>{

			/*
			if(element[0]>0){
				equises.push(this.getKilometros(0,0,0,element[0]));				
			}
			else{
				equises.push(-1*this.getKilometros(0,0,0,element[0]));				
			}
			
			if(element[1]>0){
				yeses.push(this.getKilometros(0,element[0],element[1],element[0]));
			}
			else{
				yeses.push(-1*this.getKilometros(0,element[0],element[1],element[0]));
			}
			*/
			
			equises.push(element[0]*111320.7)
			yeses.push(element[1]*110567.2)
			
		});

		console.log("Kilometros metodo nuevo");		
		console.log(equises);
		console.log(yeses);
			
		let multi1 = [];
		let multi2 = [];

		console.log("Testing area calculation...");

		for(let i = 0, j = equises.length-1; i<j; i++){
			
			multi1.push(equises[i]*yeses[i+1]);
			multi2.push(yeses[i]*equises[i+1]);
		console.log(""+equises[i]+" * "+yeses[i+1]+" = "+multi1[i] );
		console.log(""+yeses[i]+" * "+equises[i+1]+" = "+multi2[i] );
		}		
		/*
		for(let i = equises.length-1, j = 0; i>j; i--){
			
			multi2.push(equises[i]*yeses[i-1])
			console.log(""+equises[i]+" * "+yeses[i-1]+" = "+multi2[multi2.length-1] );
		}
		*/
		let sum1 = 0;
		multi1.forEach((element) =>{
			sum1+=element;
		});		
		
		console.log("SUM1:  "+sum1);
		
		let sum2 = 0;
		multi2.forEach((element) =>{
			sum2+=element;
		});
		console.log("SUM2:  "+sum2);
		
		return Math.abs((sum1-sum2)/2);
	}

  trancarExterno(){

  }

  actualizarGeojsonEditable(ev){

  	let coordenadas = JSON.parse(window.localStorage.coordenadas);
  	let init = this;
	this.geojsonEditable.geometry.type = ev.geom;

  	switch(ev.geom){

  		case "Point":

  			if(ev.tipo == "add"){

				this.geojsonEditable.geometry.coordinates = coordenadas;
				console.log(this.geojsonEditable);
				let init = this;

				this.puntosEnEdicion = window["L"].geoJSON(this.geojsonEditable, {
				
					pointToLayer: function (feature, latlng) {
						return window["L"].circleMarker(latlng, {
										radius: 8,
										fillColor: "#ff7800",
										color: "#000",
										weight: 1,
										opacity: 1,
										fillOpacity: 0.8
									});
					}}).addTo(this.activeMap);
  			}

  			if(ev.tipo == "remove"){

				if(this.puntosEnEdicion){
					this.activeMap.removeLayer(this.puntosEnEdicion);
				}  			
  			}
  		break;

  		case "LineString":


			if(this.verticesEnEdicion || this.moviendoVertice){
				
				console.log("Quitando vertices");
				this.activeMap.removeLayer(this.verticesEnEdicion);				
			} 
			
			if(this.caminoEnEdicion){
				
				console.log("Quitando el camino");
				this.activeMap.removeLayer(this.caminoEnEdicion);				
			} 

			if(coordenadas.length>1){
				this.levantarCamino(coordenadas);
			}


			console.log("añadiendo por update");

			this.levantarVertices(ev.geom, coordenadas);

			window.localStorage.coordenadas = JSON.stringify(coordenadas);
  		break;  		

  		case "Polygon":

			window.localStorage.coordenadas = JSON.stringify(coordenadas);

			if(this.verticesEnEdicion || this.moviendoVertice) this.activeMap.removeLayer(this.verticesEnEdicion);
			
			if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);

			if(this.caminoCerrado) this.activeMap.removeLayer(this.figuraEnEdicion);

			if(coordenadas[0].length>1){
				this.levantarCamino(coordenadas[0]);
			}


			console.log("añadiendo por update");

			if(this.caminoCerrado && (coordenadas[0][0][0] == coordenadas[0][coordenadas.length-1][0]) && (coordenadas[0][0][1] == coordenadas[0][coordenadas.length-1][1])){
	
				console.log("Trancando nuevamente");

				this.caminoCerrado = true;
				this.cerrarCamino(coordenadas);
			}
			else{
				if(ev.cerrada){

					console.log("Ajustar trancado");

					this.cerrarCamino(coordenadas);
				}
				else{
					
					console.log("Liberando");
					this.caminoCerrado = false;
				}
			}
			console.log(coordenadas);
			this.levantarVertices(ev.geom, coordenadas);

  		break;
  	}


  }

  cargarGeojson(capaNueva){


  	try{
  		if(!this.verificarGeojsonExistente(capaNueva)){
			this.addOverlayToControl(capaNueva);
  		}
  		else{
  			console.log("Repetido");
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }  

  cargarGeojsonFromLocal(){

  	let capaNueva = JSON.parse(window.localStorage.capaNueva);
  	console.log(capaNueva);

  	try{
  		if(!this.verificarGeojsonExistente(capaNueva)){
			this.addOverlayToControl(capaNueva);
  		}
  		else{
  			console.log("Repetido");
  		}
  	}
  	catch(err){
  		console.log(err);
  	}
  }


  removerGeojsonFromLocal(){

  	let capaVieja = localStorage.capaVieja;
  	console.log(capaVieja);
  	this.removeOverlayFromControl(capaVieja);
  }


  verificarGeojsonExistente(capaNueva){

  	let geoJson;

  	console.log(capaNueva);

  	if(capaNueva.geojson){ 
  		geoJson = capaNueva.geojson;
  	}
  	else{
  		geoJson = capaNueva;
  	}

  	let match = false;

  	let largo = geoJson.features.length;
	console.log("Largo: "+largo);
	if (largo == 0){ 
		
		console.log("No hay features");		
	}
	
	this.geoJsons.forEach((element) =>{

  		if(element.nombre == capaNueva.nombre){
  			match = true;
  		}
	});

  	return match;
  }

  removeOverlayFromControl(capaVieja){

  			this.activeMap.removeLayer(this.overlayMaps[capaVieja]);

  			let obj = this.overlayMaps;

  			this.overlayMaps = {};

  			for(let prop in obj){
  				if(prop != capaVieja) this.overlayMaps[prop] = obj[prop];
  			}

			this.activeMap.removeControl(this.control);
			this.control = window["L"].control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
			this.control.setPosition('topright');

			this.capasActivas = Object.keys(this.overlayMaps);
			window.localStorage.capasActivas = JSON.stringify(this.capasActivas);

			this.colorOverlayMaps = this.colorOverlayMaps.filter((el)=>{return el.capa != capaVieja});

			this.colorOverlayMaps.forEach((color, index)=>{

				let etiquetas = document.querySelectorAll(".leaflet-control-layers-overlays > label");
				console.log(etiquetas);
				let etiqueta = <HTMLElement>etiquetas[index].querySelector("div");
				console.log(etiqueta);

				if(color.tipo == "icono"){

					let iconito = document.createElement("div");
					iconito.setAttribute("class","cuadrito");
					let imagen = document.createElement("img");
					imagen.setAttribute("class","iconimg");	
					imagen.src = color.target;
					iconito.appendChild(imagen)

					etiqueta.appendChild(iconito);
				}
				else if(color.tipo == "figura"){

					let cuadrito = document.createElement("div");
					cuadrito.setAttribute("class","cuadrito");
					cuadrito.style.backgroundColor = "white";
					let fuente = document.createElement("i");
					fuente.setAttribute("class","fa fa-"+color.figura);
					fuente.style.color = color.target;
					cuadrito.appendChild(fuente);

					etiqueta.appendChild(cuadrito);
				}
				else{

					let cuadrito = document.createElement("div");
					cuadrito.setAttribute("class","cuadrito");
					cuadrito.style.backgroundColor = color.target;

					etiqueta.appendChild(cuadrito);
				}

			});

			this.geoJsons = this.geoJsons.filter((el)=>{return el.nombre != capaVieja});
  }

  addOverlayToControl(capaNueva){

  	let geoJson = capaNueva.geojson;
  	let tipo = this.capas.find((element) =>{return element.nombre == capaNueva.nombre}).tipo;

  	let randomColor = "";
  	let upperColor = "";

	switch(tipo){

		case 'Polygon':
		case 'MultiPolygon':

		  	randomColor = "#" + Math.random().toString(16).slice(2, 8);
		  	upperColor = randomColor.toUpperCase()
		  	console.log("Color generado: "+randomColor.toUpperCase());


			let polygonStyle = function(){
			  return { 
			    fillColor: upperColor,
			    weight: 1,
			    opacity: 1,
			    color: 'white',
			    dashArray: '3',
			    fillOpacity: 0.5
			  }
			}

			this.addPolygonLayerToControl(capaNueva, polygonStyle, upperColor);

		break;

		case 'LineString':
		case 'MultiLineString':

		  	randomColor = "#" + Math.random().toString(16).slice(2, 8);
		  	upperColor = randomColor.toUpperCase()
		  	console.log("Color generado: "+randomColor.toUpperCase());

			let lineStyle = function(){
				return {
				    "color": randomColor,
				    "weight": 5,
				    "opacity": 0.65
				}
			}

			this.addLineLayerToControl(capaNueva, lineStyle, upperColor);

		break;

		case 'Point':
		case 'MultiPoint':

		  	randomColor = "#" + Math.random().toString(16).slice(2, 8);
		  	upperColor = randomColor.toUpperCase();
		  	console.log("Color generado: "+randomColor.toUpperCase());

			let circleStyle =  {
				    radius: 8,
				    fillColor: randomColor,
				    color: "#000",
				    weight: 1,
				    opacity: 1,
				    fillOpacity: 0.8
				}

			this.addPointLayerToControl(capaNueva, circleStyle, upperColor);

		break;

		default:
			
			console.log("Desconocido");

		break;
	} //FIN DEL SWTICH


  }

  addPolygonLayerToControl(capaNueva, estilo, randomColor){

  	console.log(capaNueva);


	if(!capaNueva.geojson.features.length){

		this.geoJsons.push(capaNueva);
		return false;
	}

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});

		if(feature.geometry.type == "Polygon"){

				let area = document.createElement("li");
				area.innerHTML = "Area (Km2.): "+(Turf.area(feature)/1000000);
				ul.appendChild(area);				

				let dist = 0;

				for(let i = 0, j = feature.geometry.coordinates[0].length-1; i<j; i++){
					
					let p1 = feature.geometry.coordinates[0][i];
					let p2 = feature.geometry.coordinates[0][i+1];

					dist+= Turf.distance(p1, p2);
				}

				let perimetro = document.createElement("li");
				perimetro.innerHTML = "Perimetro (Km.): "+dist;
				ul.appendChild(perimetro);
		}
		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = window["L"].geoJSON(capaNueva.geojson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = window["L"].control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	this.control.setPosition('topleft');
	
	this.capasActivas = Object.keys(this.overlayMaps);
	window.localStorage.capasActivas = JSON.stringify(this.capasActivas);

	if(capaNueva.dontpush){

		console.log("No lo meto");
		return false;
	}
	else{

		console.log("Si lo meto");
		this.geoJsons.push(capaNueva);
	}

  }

  addLineLayerToControl(capaNueva, estilo, randomColor){


	if(!capaNueva.geojson.features.length){

		this.geoJsons.push(capaNueva);
		return false;
	}

  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);
	let popup = function(feature, layer){

	  	let popupDiv = document.createElement("div");
	  	let ul = document.createElement("ul");

		atributos.forEach((element) =>{

			if(element != "pk"){

				let li = document.createElement("li");
				li.innerHTML = ""+element+": "+feature.properties[""+element];
				ul.appendChild(li);
			}
		});

		popupDiv.appendChild(ul);
		layer.bindPopup(popupDiv);
	}

	let myLayer = window["L"].geoJSON(capaNueva.geojson, {style: estilo, onEachFeature: popup}).addTo(this.activeMap);

	let nombre = capaNueva.nombre;

	this.overlayMaps[""+capaNueva.nombre] = myLayer;

	this.activeMap.removeControl(this.control);
	this.control = window["L"].control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
	this.control.setPosition('topleft');

	this.capasActivas = Object.keys(this.overlayMaps);
	window.localStorage.capasActivas = JSON.stringify(this.capasActivas);

	if(capaNueva.dontpush) return false;

	this.geoJsons.push(capaNueva);
  }

  addPointLayerToControl(capaNueva, estilo, randomColor){

		if(capaNueva.geojson.features.length){
			
			let _self = this;

		  	let atributos = Object.getOwnPropertyNames(capaNueva.geojson.features[0].properties);

				let popup = function(feature, layer){

					let popupDiv = document.createElement("div");
					popupDiv.setAttribute("class","popupDiv");
					let tabla = document.createElement("table");
					tabla.setAttribute("class","table popup-table");

					let cabeza = document.createElement("thead");
					let cTr = document.createElement("tr");
					let cTh1 = document.createElement("th");
					cTh1.innerHTML = "Atributo";
					let cTh2 = document.createElement("th");
					cTh2.innerHTML = "Valor";

					cTr.appendChild(cTh1);
					cTr.appendChild(cTh2);
					cabeza.appendChild(cTr);

					tabla.appendChild(cabeza);

					let cuerpo = document.createElement("tbody");
				
					atributos.forEach((element) =>{

						if(element != "pk" && element != "figura" && element != "color"){

							let tr = document.createElement("tr");
							let td1 = document.createElement("td");
							td1.setAttribute("class","col-left");
							td1.innerHTML = element;
							let td2 = document.createElement("td");
							td2.innerHTML = feature.properties[""+element];

							tr.appendChild(td1);
							tr.appendChild(td2);

							cuerpo.appendChild(tr);
						}
					});
				
					let lat = document.createElement("tr");
					let latn = document.createElement("td");
					latn.setAttribute("class","col-left");
					latn.innerHTML = "Latitud";
					let latv = document.createElement("td");
					latv.innerHTML = feature.geometry.coordinates[1];
				
					lat.appendChild(latn);
					lat.appendChild(latv);

					let lng = document.createElement("tr");
					let lngn = document.createElement("td");
					lngn.innerHTML = "Longitud";
					lngn.setAttribute("class","col-left");
					let lngv = document.createElement("td");
					lngv.innerHTML = feature.geometry.coordinates[0];

					lng.appendChild(lngn);
					lng.appendChild(lngv);

					cuerpo.appendChild(lat);
					cuerpo.appendChild(lng);

					tabla.appendChild(cuerpo);
				
					popupDiv.appendChild(tabla);
					layer.bindPopup(popupDiv);

				}


			let iconoNuevo = this.getGeoIcon(capaNueva, atributos);

	
			let myLayer = window["L"].geoJSON(capaNueva.geojson, {
				pointToLayer: function (feature, latlng) {

					if(iconoNuevo.icono != null){
						
							if(iconoNuevo.color){

								return iconoNuevo.icono(latlng, {"figura": feature.properties.figura, "color": feature.properties.color});
							}
							else{
								return window["L"].marker(latlng, {icon: iconoNuevo.icono});
							}

					}else{

				        return window["L"].circleMarker(latlng, estilo);
					}
			    },
			    onEachFeature: popup}).addTo(this.activeMap);

			let nombre = capaNueva.nombre;

			this.overlayMaps[""+capaNueva.nombre] = myLayer;

			this.activeMap.removeControl(this.control);
			this.control = window["L"].control.layers(this.baseMaps, this.overlayMaps).addTo(this.activeMap);
			this.control.setPosition('topright');

			this.capasActivas = Object.keys(this.overlayMaps);
			window.localStorage.capasActivas = JSON.stringify(this.capasActivas);

			let indiceColor = this.colorOverlayMaps.findIndex((el)=>{return el.capa == capaNueva.nombre});
		
			if(iconoNuevo.figura){

				this.colorOverlayMaps.push({
					"capa": capaNueva.nombre,
					"tipo": "figura",
					"figura": iconoNuevo.figura,
					"target": iconoNuevo.color
				});
				
			}
			else{

				this.colorOverlayMaps.push({
					"capa": capaNueva.nombre,
					"tipo": iconoNuevo.icono != null ? "icono" : "color",
					"target": iconoNuevo.icono != null ? iconoNuevo.ruta : randomColor
				});

			}


			this.colorOverlayMaps.forEach((color, index)=>{

				let etiquetas = document.querySelectorAll(".leaflet-control-layers-overlays > label");
				console.log(etiquetas);
				let etiqueta = <HTMLElement>etiquetas[index].querySelector("div");
				console.log(etiqueta);

				if(color.tipo == "icono"){

					let iconito = document.createElement("div");
					iconito.setAttribute("class","cuadrito");
					let imagen = document.createElement("img");
					imagen.setAttribute("class","iconimg");	
					imagen.src = color.target;
					iconito.appendChild(imagen)

					etiqueta.appendChild(iconito);
				}
				else if(color.tipo == "figura"){

					let cuadrito = document.createElement("div");
					cuadrito.setAttribute("class","cuadrito");
					cuadrito.style.backgroundColor = "white";
					let fuente = document.createElement("i");
					fuente.setAttribute("class","fa fa-"+color.figura);
					fuente.style.color = color.target;
					cuadrito.appendChild(fuente);

					etiqueta.appendChild(cuadrito);
				}
				else{

					let cuadrito = document.createElement("div");
					cuadrito.setAttribute("class","cuadrito");
					cuadrito.style.backgroundColor = color.target;

					etiqueta.appendChild(cuadrito);
				}

			});


			if(capaNueva.dontpush) return false;

			this.geoJsons.push(capaNueva);
			
		}
		else{
	
			this.geoJsons.push(capaNueva);			
		}

  }

	montarCapaImportada(){

		let shape = window["archivoConvertidoGeojson"];

		this.addOverlayToControl(shape);


	}

	getGeoIcon(capaNueva, atributos){

			let _self = this;

			let iconoNuevo = null;
			let ruta = "";
			
			if(atributos.find((el)=>{return el == "figura"})){

				let color = capaNueva.geojson.features[0].properties.color;
				let figura = capaNueva.geojson.features[0].properties.figura;

				let icono = function(latlng, opciones){

					let options = {
					    icon: opciones.figura,
					    iconShape: 'marker',
					    borderColor: opciones.color,
					    textColor: opciones.color,
					    iconSize: [30,30],
					    iconAnchor: [15,15],
					    innerIconAnchor: [-4, 3],
					    innerIconStyle: "font-size: 1rem;",
					    backgroundColor: "white"
					};

					return window["L"]["marker"](latlng, {
						icon: window["L"]["BeautifyIcon"]["icon"](options)
					});
				}
				return {icono: icono, color: color, figura: figura};
			}

			let myRe = new RegExp("geo","i");

			if(myRe.test(capaNueva.nombre)){

				if(atributos.find((el)=>{return el.toLowerCase() == "empresa"})){

					let empresa = capaNueva.geojson.features[0].properties.empresa.toLowerCase();
					if(this.capasGeo[empresa]){


						if(!_self.capasGeo[empresa].find((el)=>{return el.usado == false})){

							for(let i = 0, j = _self.capasGeo[empresa].length; i<j; i++){
								_self.capasGeo[empresa][i].usado = false;
							}
						}

						let indiceIcono = _self.capasGeo[empresa].findIndex((el)=>{return el.usado == false});
						_self.capasGeo[empresa][indiceIcono].usado = true;

						ruta = '../../../assets/images/'+_self.capasGeo[empresa][indiceIcono].nombre;

						iconoNuevo = window["L"].icon({
						    iconUrl: ruta,
						    iconSize: [40,70],
						    iconAnchor: [20, 35],
						    popupAnchor: [-10, -10]
						    });
					}
					else{



						if(!_self.capasGeo.comun.find((el)=>{return el.usado == false})){

							for(let i = 0, j = _self.capasGeo.comun.length; i<j; i++){
								_self.capasGeo.comun[i].usado = false;
							}
						}

						let indiceIcono = _self.capasGeo.comun.findIndex((el)=>{return el.usado == false});
						_self.capasGeo.comun[indiceIcono].usado = true;

						ruta = '../../../assets/images/'+_self.capasGeo.comun[indiceIcono].nombre;

						iconoNuevo = window["L"].icon({
						    iconUrl: ruta,
						    iconSize: [40,70],
						    iconAnchor: [20, 35],
						    popupAnchor: [-10, -10]
						    });


					}

				}
				else{


					if(!_self.capasGeo.comun.find((el)=>{return el.usado == false})){

						for(let i = 0, j = _self.capasGeo.comun.length; i<j; i++){
							_self.capasGeo.comun[i].usado = false;
						}
					}

					let indiceIcono = _self.capasGeo.comun.findIndex((el)=>{return el.usado == false});
					_self.capasGeo.comun[indiceIcono].usado = true;

					ruta = '../../../assets/images/'+_self.capasGeo.comun[indiceIcono].nombre;

					iconoNuevo = window["L"].icon({
					    iconUrl: ruta,
					    iconSize: [40,70],
					    iconAnchor: [20, 35],
					    popupAnchor: [-10, -10]
					    });



				}

			}

			return {icono: iconoNuevo, ruta: ruta};

	}

  previsualizarCapa(){

	let shape = window["archivoConvertidoGeojson"];

	let popup = function(feature, layer){

  		let popupdiv = document.createElement("div");

  		let botonConfirmar = document.createElement("button");
		botonConfirmar.setAttribute("class","btn btn-outline-success");
		botonConfirmar.innerHTML = "Aceptar";

		let botonCancelar = document.createElement("button");
		botonCancelar.setAttribute("class","btn btn-outline-danger");
		botonCancelar.innerHTML = "Cancelar";

		layer.bindPopup(popupdiv);
	}

  	this.capaShapefile = window["L"].geoJSON(shape, { onEachFeature: popup }).addTo(this.activeMap);
  }

  filtrarAtributos(){

  	this.atributoFiltrado = "";
  	this.filtroElegido = "";

  	let atributos = this.capas.find((element) =>{return element.nombre == this.layerToFilter}).atributos;
  	this.attributesToFilter = atributos.filter((element) =>{return element.nombre != "geom"});
  	console.log(this.attributesToFilter);
  }

  elegirAtributo(){

  	this.filtroElegido = "";

  	this.atributoElegido = this.attributesToFilter.find((element) =>{return element.nombre == this.atributoFiltrado});
  }

  aplicarFiltro(){

  	if(this.overlayMaps[""+this.layerToFilter]){
  		this.activeMap.removeLayer(this.overlayMaps[""+this.layerToFilter]);
  	}

  	let geojson = this.geoJsons.find((element) =>{return element.nombre == this.layerToFilter}).geojson;

  	let features = [];

  	switch(this.filtroElegido){

  		case "mayor":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] > this.valorBusqueda});
  		break;

  		case "mayorigual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] >= this.valorBusqueda});
  		break;

  		case "menor":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] < this.valorBusqueda});
  		break;

  		case "menorigual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] <= this.valorBusqueda});
  		break;

  		case "igual":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] == this.valorBusqueda});
  		break;

  		case "diferente":

  			features = geojson.features.filter((element) =>{return element.properties[""+this.atributoElegido.nombre] != this.valorBusqueda});
  		break;
  	}

  	let capaNueva = {
  		"nombre": this.layerToFilter,
  		"geojson": {
  			"type": geojson.type,
  			"features": features
  		},
  		"dontpush": true
  	}

  	console.log(capaNueva);
	this.addOverlayToControl(capaNueva);
  }

  refrescarMapa(evento){


  	console.log(evento);

	if(this.verticesEnEdicion) this.activeMap.removeLayer(this.verticesEnEdicion);
	if(this.caminoEnEdicion) this.activeMap.removeLayer(this.caminoEnEdicion);
	if(this.figuraEnEdicion) this.activeMap.removeLayer(this.figuraEnEdicion);
	if(this.puntosEnEdicion) this.activeMap.removeLayer(this.puntosEnEdicion);

  	if(!evento){

  		if(window.localStorage.capaActiva) window.localStorage.removeItem("capaActiva");
  		if(window.localStorage.coordenadas) window.localStorage.removeItem("coordenadas");
  		return false;
  	}

  	if(this.overlayMaps[evento.nombre]){
	  	this.activeMap.removeLayer(this.overlayMaps[""+evento.nombre]);
  	}

  	evento.dontpush = true;

  	let indice = this.geoJsons.findIndex((element) =>{return element.nombre == evento.nombre});
  	this.geoJsons[indice] = evento;
	this.addOverlayToControl(evento);
  }

  agregarDatos(){

  	document.getElementById("montar").click();
  	this.agregarDatosActivado = true;
 
  }

  terminarAgregar(ev){

  	console.log(ev)

  	this.agregarDatosActivado = false;
  }

  editarDatos(){

  	document.getElementById("montar").click();
  	this.editarDatosActivado = true;
  }

  terminarEditar(ev){

  	if(ev){
  		this.editarDatosActivado = false;
  	}

  }

  eliminarDatos(){

  	document.getElementById("montar").click();
  	this.eliminarDatosActivado = true;
  }

  terminarEliminar(ev){

  	if(ev){
  		this.eliminarDatosActivado = false;
  	}

  }

  openFilter(content) {

    this.modalService.open(content,{ windowClass: 'dark-modal' }).result.then((result) => {

		console.log("Saludos");

    }, (reason) => {

    });

	var el = document.getElementsByClassName("modal-content");
	el[0].setAttribute("style","background-color: rgba(255,255,255,0.4)");
  }

  limpiarFiltro(){

  	if(this.overlayMaps[""+this.layerToFilter]){
  		this.activeMap.removeLayer(this.overlayMaps[""+this.layerToFilter]);
  	}

  	let geojson = this.geoJsons.find((element) =>{return element.nombre == this.layerToFilter}).geojson;


  	let capaNueva = {
  		"nombre": this.layerToFilter,
  		"geojson": {
  			"type": geojson.type,
  			"features": geojson.features
  		},
  		"dontpush": true
  	}

  	console.log(capaNueva);
	this.addOverlayToControl(capaNueva);
  
  }

  	tomarFoto(){
		
		this.shout("Espere un momento mientras su imagen es capturada", "alert-info", 3000);
		this.loading = true;
		
		let init = this;
		
		leafletImage(this.activeMap, function(err, canvas){
		
			var img = document.createElement("img");
			var size = init.activeMap.getSize();
		
			img.width = size.x;
			img.height = size.y;

			img.src = canvas.toDataURL();
			
			let init2 = init;
			
			img.addEventListener("load", function(ev){
				
				init2.dibujarFoto(img);
				init2.fotoDibujada = true;
				init2.loading = false;
				init2.foto = img;
			});
		});
	}
	
	dibujarFoto(img){

		var canvas = document.createElement("canvas");
		canvas.setAttribute("id","myCanvas");
		canvas.width = 300;
		canvas.height = 300;

		var ctx = canvas.getContext("2d");
		

		if(!document.getElementById("myCanvas")){
			document.getElementById("fotoCanvas").appendChild(canvas);
		}
			
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}
	
	descargarFoto(){

		var link = document.createElement("a");
		link.href = this.foto.src;
		link.download = 'Download.jpg';
		link.click();
		
	}

	toggleDistance(){

		if(document.querySelector(".distanceDialog.hidden")){

			document.querySelector(".distanceDialog.hidden").setAttribute("class","distanceDialog");
		}
		else{
		
			document.querySelector(".distanceDialog").setAttribute("class","distanceDialog hidden");
		}

	}

	toggleArea(){

		if(document.querySelector(".areaDialog.hidden")){

			document.querySelector(".areaDialog.hidden").setAttribute("class","areaDialog");
		}
		else{
		
			document.querySelector(".areaDialog").setAttribute("class","areaDialog hidden");
		}

	}


	togglePoint(){

		if(document.querySelector(".pointDialog.hidden")){

			document.querySelector(".pointDialog.hidden").setAttribute("class","pointDialog");
		}
		else{
		
			document.querySelector(".pointDialog").setAttribute("class","pointDialog hidden");
		}

	}


	toggleData(){

		if(document.querySelector(".dataDialog.hidden")){

			document.querySelector(".dataDialog.hidden").setAttribute("class","dataDialog");
		}
		else{
		
			document.querySelector(".dataDialog").setAttribute("class","dataDialog hidden");
		}

	}

	irCentro(){
		this.activeMap.setView([10.4263649457595, -64.149649060059]);
	}

}
