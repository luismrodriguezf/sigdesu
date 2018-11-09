import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeComponent } from './componentes/home/home.component';
import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap/collapse/collapse.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion/accordion.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';


import {GalleriaModule, ButtonModule, DialogModule, GrowlModule, ProgressBarModule} from 'primeng/primeng';
import { MapaComponent} from './componentes/mapa/mapa.component';
import { PopupModalContentComponent } from './componentes/mapa/popup-modal-content.component';
import { FooterComponent } from './componentes/footer/footer.component';
import {TableModule} from 'primeng/table';
//servicios
import {CasosService} from './services/casos.service';
import {SucesosService} from './services/sucesos.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './services/guard.service';

import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { CrearCategoriasComponent } from './componentes/categorias/crear/crear.component';
import { BuscarCategoriasComponent } from './componentes/categorias/buscar/buscar.component';
import { ActualizarCategoriasComponent } from './componentes/categorias/actualizar/actualizar.component';
import { EliminarCategoriasComponent } from './componentes/categorias/eliminar/eliminar.component';
import { CategoriasService } from './services/categorias/categorias.service';

import { DatosComponent } from './componentes/datos/datos.component';
import { AgregarDatosComponent } from './componentes/datos/agregar/agregar.component';
import { BuscarDatosComponent } from './componentes/datos/buscar/buscar.component';
import { ActualizarDatosComponent } from './componentes/datos/actualizar/actualizar.component';
import { EliminarDatosComponent } from './componentes/datos/eliminar/eliminar.component';
import { DatosService } from './services/datos/datos.service';

import { CapasComponent } from './componentes/capas/capas.component';
import { CrearCapasComponent } from './componentes/capas/crear/crear.component';
import { BuscarCapasComponent } from './componentes/capas/buscar/buscar.component';
import { ActualizarCapasComponent } from './componentes/capas/actualizar/actualizar.component';
import { EliminarCapasComponent } from './componentes/capas/eliminar/eliminar.component';
import { ImportarCapasComponent, ImportarCapasContent } from './componentes/capas/importar/importar.component';
import { CapasService } from './services/capas/capas.service';

import { CasosComponent } from './componentes/casos/casos.component';
import { SucesosComponent } from './componentes/sucesos/sucesos.component';
import { ProfileComponent } from './componentes/profile/profile.component';

const appRoutes : Routes = [
 { path: '', component: HomeComponent},
 { path: 'mapa', component: MapaComponent},
 { path: 'casos', component: CasosComponent, canActivate: [AuthGuard]},
 { path: 'sucesos', component: SucesosComponent, canActivate: [AuthGuard]},
 { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
]

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        MapaComponent,
        PopupModalContentComponent,
        FooterComponent,
        CasosComponent,
        SucesosComponent,
        ProfileComponent,
        DatosComponent,
        AgregarDatosComponent,
        BuscarDatosComponent,
        ActualizarDatosComponent,
        EliminarDatosComponent,
        CategoriasComponent,
        CrearCategoriasComponent,
        BuscarCategoriasComponent,
        ActualizarCategoriasComponent,
        EliminarCategoriasComponent,
        CapasComponent,
        CrearCapasComponent,
        ImportarCapasComponent,
        ImportarCapasContent,
        BuscarCapasComponent,
        ActualizarCapasComponent,
        EliminarCapasComponent
    ],
    imports: [
        NgbModalModule.forRoot(),
        NgbCollapseModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgbAccordionModule.forRoot(),
        NgbPopoverModule.forRoot(),
        FlashMessagesModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        GalleriaModule,
        DialogModule,
        ButtonModule,
        GrowlModule,
        TableModule,
        ProgressBarModule
    ],
    entryComponents: [
        ImportarCapasContent,
        PopupModalContentComponent
    ],
    providers: [CapasService, CasosService, SucesosService, AuthService, AuthGuard, CategoriasService, DatosService],
    bootstrap: [AppComponent]
})
export class AppModule { }
