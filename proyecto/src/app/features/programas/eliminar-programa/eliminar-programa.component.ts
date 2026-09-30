import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramasService } from '../../../core/services/programas.service';

@Component({
  selector: 'app-eliminar-programa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Eliminar Programa</h2>
    <p *ngIf="mensaje">{{ mensaje }}</p>
    <button (click)="volver()">Volver</button>
  `,
  styleUrls: []
})
export class EliminarProgramaComponent implements OnInit {
  mensaje: string = '';
  filename: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programasService: ProgramasService
  ) {}

  ngOnInit(): void {
    this.filename = this.route.snapshot.paramMap.get('id') || '';
    if (this.filename) {
      this.programasService.eliminarPrograma(this.filename).subscribe(
        response => {
          // Verificamos que el status sea "deleted"
          if (response.status && response.status[0] === "deleted") {
            this.mensaje = `El archivo ${response.file[0]} ha sido eliminado correctamente.`;
          } else {
            this.mensaje = "No se pudo eliminar el archivo.";
          }
        },
        error => {
          console.error("Error al eliminar el programa", error);
          this.mensaje = "Error al eliminar el programa.";
        }
      );
    } else {
      this.mensaje = "No se proporcionó un archivo válido.";
    }
  }
  

  volver(): void {
    this.router.navigate(['/programas']);
  }
}
