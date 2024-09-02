// libro-list.component.spec.ts
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SolicitudPrestamosNuevoComponent } from './solicitud-prestamos-nuevo.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { SolicitudPrestamoService } from 'src/services/solicitudPrestamo.service';
import { of, throwError } from 'rxjs';
import { UsuarioService } from 'src/services/usuario.service';
import { CopiaLibroService } from 'src/services/copiaLibro.service';


describe('SolicitudPrestamoNuevo', () => {
  let component: SolicitudPrestamosNuevoComponent;
  let fixture: ComponentFixture<SolicitudPrestamosNuevoComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<any>>;
  let solicitudPrestamoServiceSpy: jasmine.SpyObj<SolicitudPrestamoService>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let copiaLibroServiceSpy: jasmine.SpyObj<CopiaLibroService>;



  beforeEach(waitForAsync(() => {

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    solicitudPrestamoServiceSpy = jasmine.createSpyObj('SolicitudPrestamoService', ['crear']);
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    copiaLibroServiceSpy = jasmine.createSpyObj('CopiaLibroService', ['getCopiaLibros']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,MatAutocompleteModule, ReactiveFormsModule], 
      declarations: [ SolicitudPrestamosNuevoComponent ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: SolicitudPrestamoService, useValue: solicitudPrestamoServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: CopiaLibroService, useValue: copiaLibroServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPrestamosNuevoComponent);
    component = fixture.componentInstance;
    component.initForm();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('ngOnInit', () => {
    spyOn(component,'getParametros');
    spyOn(component,'initForm')

    component.ngOnInit();

    expect(component.getParametros).toHaveBeenCalled();
    expect(component.initForm).toHaveBeenCalled();
  });

 
  it('should initialize the form with correct controls', () => {
    const valor = "Hola Mundo";
    // Act: Llama al método initForm
   
    const usuarioControl = component.form.get('usuario');
    const libroControl = component.form.get('libro');

    // Assert: Verifica que el formulario tenga los controles correctos
    expect(component.form.contains('usuario')).toBeTruthy();
    expect(component.form.contains('libro')).toBeTruthy();

    // Assert: Verifica que los validadores sean correctos
    expect(usuarioControl?.valid).toBeFalsy(); // Debería ser inválido inicialmente porque es requerido
    expect(usuarioControl?.hasError('required')).toBeTruthy(); // Debería tener un error de 'required'
    
    expect(libroControl?.valid).toBeTruthy(); // Debería ser válido ya que no tiene validadores
    
    //verificamos que usuario tenga el valor de Hola Mundo
    component.form.controls["usuario"].setValue("Hola Mundo");
    expect(component.form.controls["usuario"].value).toBe(valor);

    component.form.controls["usuario"].setValue("");
    expect(component.form.invalid).toBe(true);
    
    component.form.controls["usuario"].setValue("123");
    component.form.controls["libro"].setValue("1");
    expect(!component.form.invalid).toBe(true);
  });


  it('should show an error when there are 3 selected books or the form value is empty', () => {
    // Arrange: Configurar el estado inicial
   
    component.librosSelecionados = [{ Libro: 'Book 1' },{ Libro: 'Book 3' }];
    component.form.controls['libro'].setValue(''); // Simular un valor vacío en el formulario

    // Act: Espiar el método de SweetAlert
    spyOn(Swal, 'fire');

    // Llamar al método agregarLibros
    component.agregarLibros({});

    // Assert: Verificar que se haya mostrado el mensaje de error
    expect(Swal.fire).toHaveBeenCalled();
  });


  it('caso positivo de agregar libros', () => {
    // Arrange: Configurar el estado inicial
   
    component.librosSelecionados = [];
    component.form.controls['libro'].setValue('Alicia en el páis de las maravillas.'); // Simular un valor vacío en el formulario

    // Llamar al método agregarLibros
    component.agregarLibros({});


    // Assert: Verificar que se haya mostrado el mensaje de error
    expect(component.librosSelecionados.length).toBe(1);
    expect(component.librosSelecionadosId.length).toBe(1);
  });


  it('getRequest', () => {

  
    component.form.controls["usuario"].setValue("13-Adrian");
    component.librosSelecionadosId = [{ id: 1 }, { id: 2 }];

    const result = component.getRequest();

    expect(result.IdUsuario).toBe(13);
    expect(result.IdCopiaLibro.length).toBe(2);
  });


  it('onNoClick', () => {

    component.onNoClick();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
  


  it('guardar formulario invalido', () => {

    
    component.form.controls["usuario"].setValue("");

    component.guardar();
    
    expect(component.form.invalid).toBeTrue();
  });


  
  it('should call registrarSolicitud() if user confirms', fakeAsync(() => {
    component.form.controls["usuario"].setValue("13-Adrian");

    spyOn(component, 'mostrarConfirmacion').and.returnValue(Promise.resolve({ isConfirmed: true }));
    spyOn(component, 'registrarSolicitud');
  
    component.guardar();
    tick(); // Avanza el reloj para completar las promesas pendientes
  
    expect(component.registrarSolicitud).toHaveBeenCalled();
  }));


  it('mostrarConfirmacion',fakeAsync(() => {
    const expectedResult: any = {
      icon: 'question',
      html: '¿Está seguro de registrar la solicitud?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#028484',
      denyButtonText: 'No',
      denyButtonColor: '#028484'
    }

    // Espía la llamada a Swal.fire y configura el valor de retorno
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve(expectedResult));

    const result = component.mostrarConfirmacion();
    tick();

    const expectedConfig: any = {
      icon: 'question',
      html: '¿Está seguro de registrar la solicitud?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#028484',
      denyButtonText: 'No',
      denyButtonColor: '#028484'
    };

    expect(result).toBeInstanceOf(Promise);
    result.then((res) => {
      expect(res).toEqual(expectedResult);
    });
  }));
  

  it('should call mostrarMensajeExito on successful request', () => {
    // Configura el espía para devolver un observable exitoso
    const mockResponse = { success: true }; // Ajusta según tu respuesta esperada
    solicitudPrestamoServiceSpy.crear.and.returnValue(of(mockResponse));

    // Espía el método mostrarMensajeExito
    spyOn(component, 'mostrarMensajeExito');

    // Llama al método registrarSolicitud
    component.registrarSolicitud();

    // Verifica que mostrarMensajeExito fue llamado
    expect(component.mostrarMensajeExito).toHaveBeenCalled();
  });


  it('should call mostrarMensajeExito on error request', () => {
    // Configura el espía para devolver un observable exitoso
    const mockResponse = { success: false }; // Ajusta según tu respuesta esperada
    solicitudPrestamoServiceSpy.crear.and.returnValue(throwError(mockResponse));

    // Espía el método mostrarMensajeExito
    spyOn(component, 'mostrarMensajeError');

    // Llama al método registrarSolicitud
    component.registrarSolicitud();

    // Verifica que mostrarMensajeExito fue llamado
    expect(component.mostrarMensajeError).toHaveBeenCalled();
  });



  it('mostrarConfirmacion',(() => {
    const data:any = {
      icon: 'success',
      title: '',
      html: 'Se registró correctamente',
      color: '#028484',
      showConfirmButton: true,
      confirmButtonColor: '#028484'
    }
    const result = spyOn(Swal,'fire');

    component.mostrarMensajeExito();

     expect(result).toHaveBeenCalledWith(data); 

  }));


  it('mostrarMensajeError',(() => {
    const data:any = {
      icon: 'error',
      title: 'Ocurrió un error',
      color: '#028484',
      showConfirmButton: true,
      confirmButtonColor: '#028484'
    }
    const result = spyOn(Swal,'fire');

    component.mostrarMensajeError("");

     expect(result).toHaveBeenCalledWith(data); 

  }));


  it('getParametros',(() => {
   component.getParametros();

   expect(usuarioServiceSpy.getUsuarios).toHaveBeenCalled();
   expect(copiaLibroServiceSpy.getCopiaLibros).toHaveBeenCalled();
  }));


  xit('getParametros suscripcion',(() => {
    const mockDataUser = [{id:1, nombre:"Abel"}, {id:2, nombre:"Adriana"}];
    const mockDataCopiaLibros = [{id:1, nombre: "Alicia en el pais de las maravillas"}, {id:2, nombre:"Libro ABC"}]
 
   // usuarioServiceSpy.getUsuarios.and.returnValue(of(mockDataUser));
    usuarioServiceSpy.getUsuarios.and.callFake(() => {
      return of(mockDataUser);
    });

    copiaLibroServiceSpy.getCopiaLibros.and.returnValue(of(mockDataCopiaLibros));

    component.getParametros();
 
    expect(component.usuariosItems.length).toEqual(2);
    expect(component.copiaLibrosItems.length).toEqual(2);
   }));


   it('PARAMETROS',(() => {
      usuarioServiceSpy.getUsuarios.and.callFake(() => {
        return of([{ nombre:'Adrian'}, { nombre: 'Jose'}])
      })

      copiaLibroServiceSpy.getCopiaLibros.and.callFake(() => {
        return of([{id:1, nombre:'Adrian'}, {id:2, nombre: 'Jose'}])
      })


      component.getParametros();

      expect(component.usuariosItems.length).toBeGreaterThan(1);
      expect(component.copiaLibrosItems.length).toBeGreaterThan(1);
   }));
});
