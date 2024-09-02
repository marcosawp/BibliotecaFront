import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LibroService } from 'src/services/libro.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-libro-list',
  templateUrl: './libro-list.component.html',
  styleUrls: ['./libro-list.component.css']
})
export class LibroListComponent implements OnInit,AfterViewInit {
  displayedColumns: string[] = ['iD_Libro', 'titulo', 'autor', 'genero','anioPublicacion','actions'];
  dataSource!: MatTableDataSource<any>;
  errorMsg: String  = "";
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  _libroService =  inject(LibroService);
  
  constructor() {
  }
  ngOnInit(): void {
   this.getLibros();
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

  getLibros(){

    this._libroService.getLibros().subscribe({
      next: (data) => {
        this.setDataSource(data);
        console.log(data)
      }, error: err => {
      this.errorMsg = "Ocurrio un error"
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
