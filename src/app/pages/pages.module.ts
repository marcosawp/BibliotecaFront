import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LibroComponent } from './libro/libro/libro.component';
import { LibroListComponent } from './libro/libro-list/libro-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table'  
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog'
import { SolicitudPrestamosListComponent } from './solicitudPrestamo/solicitud-prestamos-list/solicitud-prestamos-list.component';
import { SolicitudPrestamosComponent } from './solicitudPrestamo/solicitud-prestamos/solicitud-prestamos.component';
import { SolicitudPrestamosNuevoComponent } from './solicitudPrestamo/solicitud-prestamos-nuevo/solicitud-prestamos-nuevo.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
    {
        path: 'libros',
        component: LibroComponent
    },
    {
        path: 'solicitudPrestamos',
        component: SolicitudPrestamosComponent
    }
  ];

@NgModule({
  declarations: [
    LibroComponent,
    LibroListComponent,
    SolicitudPrestamosListComponent,
    SolicitudPrestamosComponent,
    SolicitudPrestamosNuevoComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
