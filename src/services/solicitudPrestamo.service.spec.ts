import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudPrestamoService } from './solicitudPrestamo.service';
import { of } from 'rxjs';
// Asegúrate de que esta ruta sea correcta

describe('SolicitudPrestamoService', () => {
  let service: SolicitudPrestamoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5188/api'; // Reemplaza con la URL base correcta

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolicitudPrestamoService]
    });

    service = TestBed.inject(SolicitudPrestamoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should fetch solicitud prestamos from API', () => {
    // Arrange: Datos simulados
    const mockResponse = [
      { id: 1, nombre: 'Solicitud 1' },
      { id: 2, nombre: 'Solicitud 23' }
    ];

    const mockResponse2 = [
        { id: 1, nombre: 'Solicitud 1' },
        { id: 2, nombre: 'Solicitud 23' }
      ];
  
    // Act: Llamar al método
    service.getSolicitudPrestamos().subscribe((response:any) => {
      // Assert: Verificar que la respuesta es la esperada
      expect(response).toEqual(mockResponse2);
    });

    // Assert: Verificar que la solicitud HTTP se realizó con la URL correcta
    const req = httpMock.expectOne(`${apiUrl}/SolicitudPrestamo`);
    expect(req.request.method).toBe('GET');
   
  });

  it('crear', () => {
    const rpta = true;
    const rpta2 = true;
    const id = 1;

    service.crear(id).subscribe((data:any) => {
        expect(data).toEqual(true);
    })

    const req = httpMock.expectOne(`${apiUrl}/SolicitudPrestamo`);
    expect(req.request.method).toBe("POST");
    req.flush(rpta);

  });
});
