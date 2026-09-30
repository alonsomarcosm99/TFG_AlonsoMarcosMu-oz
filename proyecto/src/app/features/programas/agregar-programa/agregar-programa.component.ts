import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgramasService } from '../../../core/services/programas.service';
import { HttpEventType } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UploadSuccessDialogComponent } from './upload-success-dialog.component';

@Component({
  selector: 'app-agregar-programa',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatProgressBarModule, MatDialogModule],
  templateUrl: './agregar-programa.component.html',
  styleUrls: []
})
export class AgregarProgramaComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  mensaje: string = '';

  constructor(
    private router: Router,
    private programasService: ProgramasService,
    private dialog: MatDialog
  ) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  subirArchivo(): void {
    if (!this.selectedFile) {
      this.mensaje = 'Por favor, seleccione un archivo';
      return;
    }

    this.programasService.uploadPrograma(this.selectedFile).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          // Abrir el diálogo de éxito de forma programática
          const dialogRef = this.dialog.open(UploadSuccessDialogComponent, {
            width: '400px'
          });
          dialogRef.afterClosed().subscribe(() => {
            this.router.navigate(['/programas']);
          });
        }
      },
      error => {
        console.error('Error al subir el archivo', error);
        this.mensaje = 'Error al subir el archivo';
      }
    );
  }
  cerrar(): void {
    this.router.navigate(['/programas']);
  }
}
