import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SolicitudPrestamosNuevoComponent } from '../solicitud-prestamos-nuevo/solicitud-prestamos-nuevo.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SolicitudPrestamoService } from 'src/services/solicitudPrestamo.service';

@Component({
  selector: 'app-solicitud-prestamos-list',
  templateUrl: './solicitud-prestamos-list.component.html',
  styleUrls: ['./solicitud-prestamos-list.component.css']
})
export class SolicitudPrestamosListComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['iD_SolicitudPrestamo', 'iD_Usuario', 'estado','actions'];
  dataSource!: MatTableDataSource<any>;
  _solicitudPrestamoService =  inject(SolicitudPrestamoService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getSolicitudPrestamos();
  }

  setDataSource(data: any) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  nuevaSolicitud(){
    const dialogRef = this.dialog.open(SolicitudPrestamosNuevoComponent, {
      width:'30%',
     
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSolicitudPrestamos();
    });
  }

  getSolicitudPrestamos(){

    this._solicitudPrestamoService.getSolicitudPrestamos().subscribe({
      next: (data) => {
        this.setDataSource(data);
        console.log(data)
      }, error: err => {
        console.log(err);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

