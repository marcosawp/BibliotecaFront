import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CopiaLibroService } from 'src/services/copiaLibro.service';
import { SolicitudPrestamoService } from 'src/services/solicitudPrestamo.service';
import { UsuarioService } from 'src/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-prestamos-nuevo',
  templateUrl: './solicitud-prestamos-nuevo.component.html',
  styleUrls: ['./solicitud-prestamos-nuevo.component.css']
})
export class SolicitudPrestamosNuevoComponent implements OnInit {
  form! : FormGroup;
  librosSelecionadosId: any = [];
  librosSelecionados: any = [];
  usuariosItems: string[] = [];
  copiaLibrosItems: any = [];


  _usuarioService =  inject(UsuarioService);
  _copiaLibroService =  inject(CopiaLibroService);
  _solicitudPrestamoService =  inject(SolicitudPrestamoService);

  constructor(public dialogRef: MatDialogRef<SolicitudPrestamosNuevoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder) {
   
  }

  ngOnInit(): void {
    this.getParametros();
    this.initForm();
  }

  initForm(){
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      libro:  ['']
    });
    
  }

  agregarLibros(event:any){
  
    if(this.librosSelecionados.length === 3 || this.form.controls['libro'].value.length === 0){
      Swal.fire({
        icon: 'error',
        title: "Debe escoger un Libro y adicionar como máximo 3",
        color: '#028484' ,
        showConfirmButton: true,
        confirmButtonColor: '#028484' ,
      })
      return;
    }
    this.librosSelecionados.push({
      Libro : this.form.controls['libro'].value
     });

    this.librosSelecionadosId.push({
      id: parseInt((this.form.controls['libro'].value).toString().split("-")[0].trim())
     });
  }

  getParametros(){

    forkJoin([
      this._usuarioService.getUsuarios(),
      this._copiaLibroService.getCopiaLibros(),
    ]).subscribe({
      next: (data) => {
        console.log(data)
        let dataUser:any = data[0];
        let dataCopiaLibros:any  = data[1];
        this.usuariosItems = dataUser.map((usuario:any) => `${usuario.iD_Usuario} - ${usuario.nombres} ${usuario.apellidos} - DNI: ${usuario.numDocumento}`);
        this.copiaLibrosItems = dataCopiaLibros.map((libro:any) => {
          return {
              texto: `${libro.iD_Copia} - ${libro.titulo} - QR: ${libro.codigoBarras}`,
              flag: libro.estado
          };
      }
    ); 
      }, error: err => {
        console.log(err);
      }
    })
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.mostrarConfirmacion().then((result) => {
      if (result.isConfirmed) {
        this.registrarSolicitud();
      }
    });
  }
  
  public mostrarConfirmacion(): Promise<any> {
    return Swal.fire({
      icon: 'question',
      html: '¿Está seguro de registrar la solicitud?',
      showDenyButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#028484',
      denyButtonText: 'No',
      denyButtonColor: '#028484'
    });
  }
  
  public registrarSolicitud() {
    this._solicitudPrestamoService.crear(this.getRequest()).subscribe({
      next: (data: any) => this.mostrarMensajeExito(),
      error: (err: any) => this.mostrarMensajeError(err)
    });
  }
  
  public mostrarMensajeExito() {
    Swal.fire({
      icon: 'success',
      title: '',
      html: 'Se registró correctamente',
      color: '#028484',
      showConfirmButton: true,
      confirmButtonColor: '#028484'
    });
    this.dialogRef.close();
  }
  
  public mostrarMensajeError(err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un error',
      color: '#028484',
      showConfirmButton: true,
      confirmButtonColor: '#028484'
    });
  }
  

  onNoClick(): void {
    this.dialogRef.close();
  }


  getRequest(){
    const usuarioValue = this.form.controls["usuario"].value;
    
    const idUsuario = parseInt(usuarioValue.toString().split("-")[0].trim());


    var obj = {
      IdUsuario: idUsuario,
      IdCopiaLibro:  this.librosSelecionadosId.map((item:any) => item.id)
    };
    return obj;
  }
}
