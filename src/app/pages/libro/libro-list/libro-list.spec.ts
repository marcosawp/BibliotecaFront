// libro-list.component.spec.ts
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError, throwIfEmpty } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LibroService } from 'src/services/libro.service';
import { LibroListComponent } from './libro-list.component';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LibroListComponent', () => {
 
  let libroServiceSpy: jasmine.SpyObj<LibroService>;
  let component : LibroListComponent;
  let fixture : ComponentFixture<LibroListComponent>;

  beforeEach(() => {
    libroServiceSpy = jasmine.createSpyObj('LibroService', ['getLibros']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      declarations: [  ],
      providers: [
        { provide: LibroService , useValue: libroServiceSpy}
      ]
    }).compileComponents();

  });

  beforeEach(() => {
 
    fixture = TestBed.createComponent(LibroListComponent);
    component = fixture.componentInstance;
  });  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    const getLibrosCall = spyOn(component,'getLibros');

    component.ngOnInit();

    expect(getLibrosCall).toHaveBeenCalled();
  });

  it('setDatasource', () => {
    const mockData = [{id:1, name:"Jose"}, {id:2, name:"Paolo"}];

    component.setDataSource(mockData);

    expect(component.dataSource.data).toEqual(mockData);
  });

  it('afterviewinit', () => {

    const mockData = [{id:1, name:"Jose"}, {id:2, name:"Paolo"}];

    component.setDataSource(mockData);

    component.ngAfterViewInit();

    expect(component.dataSource.paginator).not.toBeNull();
  });


  it('getLibros()', () => {
    
    libroServiceSpy.getLibros.and.returnValue( of([{id:1, nombre:"Joseeee"}]) );
    
    component.getLibros();
  
    expect(component.dataSource.data.length).toBe(1);

  });

  it('getLibros() error', () => {
    
    libroServiceSpy.getLibros.and.returnValue( throwError(() => false ));
    
    component.getLibros();
  
    expect(component.errorMsg).toEqual("Ocurrio un error");

  });
  
  it('applyfilter', () => {
    
    const filterValue = 'Test Book 23';
    const event = { target: { value: filterValue } } as unknown as Event;
    const mockData = [{ id: 1, title: 'Test Book', author: 'Test Author', genre: 'Fiction', year: 2020 },
      { id: 2, title: 'Test Book 23', author: 'Test Author', genre: 'Fiction', year: 2020 }
    ];
    
    component.setDataSource(mockData);
    component.applyFilter(event);
    
    const filteredData = component.dataSource.filteredData;
    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
    expect(filteredData[0].title).toBe('Test Book 23');

  });
});
