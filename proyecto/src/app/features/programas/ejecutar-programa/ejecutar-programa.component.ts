import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramasService } from '../../../core/services/programas.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-ejecutar-programa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule
  ],
  templateUrl: './ejecutar-programa.component.html',
  styleUrls: ['./ejecutar-programa.component.css']
})
export class EjecutarProgramaComponent implements OnInit {
  programa: any = null;
  parametros: string[] = [];
  // 'valores' contendrá los datos ingresados por el usuario
  valores: { [key: string]: any } = {};
  resultado: any = null;
  imageUrl: string | null = null;
  tableResult: any[] | null = null;
  mensajeResultado: string | null = null;  // Mensaje de resultado (éxito o error)
  mostrarMetadatos: boolean = false;
  esError: boolean = false; // Indica si ocurrió un error según la respuesta HTTP

  constructor(
    private programasService: ProgramasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.programa = this.programasService.getProgramaById(id);
      if (!this.programa) {
        this.programasService.listarProgramas().subscribe(data => {
          this.programa = data.find(p => {
            if (Array.isArray(p.id)) {
              return p.id[0] === id;
            }
            return p.id === id;
          });
          if (this.programa) {
            this.inicializarParametros();
          } else {
            console.error("No se encontró el programa con id", id);
          }
        });
      } else {
        this.inicializarParametros();
      }
    }
  }

  private inicializarParametros(): void {
    this.parametros = this.programa['parametros'] || [];
    // Se utiliza 'defaults' (sin acentos) para mostrar la sugerencia en el placeholder.
    // Si 'prefill' es true se asigna al modelo; de lo contrario se deja vacío.
    const prefill = this.programa.prefill || false;
    if (this.programa.defaults) {
      this.parametros.forEach(param => {
        // Como los valores en defaults vienen como arreglo, usamos el primer elemento
        this.valores[param] = prefill && this.programa.defaults[param] ? this.programa.defaults[param][0] : "";
      });
    } else {
      this.parametros.forEach(param => {
        this.valores[param] = "";
      });
    }
  }

  verMetadatos(): void {
    this.mostrarMetadatos = !this.mostrarMetadatos;
  }

  ejecutar(): void {
    this.esError = false;
    if (this.programa['tipo'] && this.programa['tipo'][0] === 'table') {
      this.programasService.ejecutarProgramaTable(this.programa.id, this.valores)
        .subscribe(data => {
          if (data && data.status && Array.isArray(data.status) && data.status[0].toLowerCase() === 'error') {
            this.mensajeResultado = (Array.isArray(data.message) ? data.message[0] : data.message) + "\nRevise los metadatos";
            this.esError = true;
            this.tableResult = null;
          } else {
            this.tableResult = data;
            this.mensajeResultado = null;
            this.esError = false;
          }
          this.imageUrl = null;
          this.resultado = null;
        }, error => {
          console.error("Error al ejecutar el programa tipo table", error);
          this.procesarError(error);
        });
    } else {
      this.programasService.ejecutarPrograma(this.programa.id, this.valores)
        .subscribe(blob => {
          if (blob.type.startsWith('image/')) {
            this.imageUrl = URL.createObjectURL(blob);
            this.resultado = null;
            this.tableResult = null;
            this.mensajeResultado = null;
            this.esError = false;
          } else {
            const reader = new FileReader();
            reader.onload = () => {
              try {
                const jsonResult = JSON.parse(reader.result as string);
                if (jsonResult.resultados) {
                  this.mensajeResultado = (jsonResult.mensaje && jsonResult.mensaje.length > 0)
                                            ? jsonResult.mensaje[0] : 'Estadísticas calculadas';
                  this.mensajeResultado += "\nRevise los metadatos";
                  this.resultado = jsonResult.resultados;
                  if (this.resultado && Object.values(this.resultado).some(val => Array.isArray(val) ? val[0] === "NA" : val === "NA")) {
                    this.esError = true;
                  } else {
                    this.esError = false;
                  }
                } else if (jsonResult.status && Array.isArray(jsonResult.status) &&
                           jsonResult.status[0].toLowerCase() === 'error') {
                  this.mensajeResultado = (Array.isArray(jsonResult.message) ? jsonResult.message[0] : jsonResult.message)
                                          + "\nRevise los metadatos";
                  this.esError = true;
                  this.resultado = null;
                } else {
                  this.mensajeResultado = (jsonResult.mensaje && jsonResult.mensaje.length > 0)
                                            ? jsonResult.mensaje[0] : '';
                  this.esError = false;
                  this.resultado = null;
                }
              } catch (e) {
                this.mensajeResultado = reader.result as string;
                this.esError = this.mensajeResultado.toLowerCase().includes("error") ||
                               this.mensajeResultado.toLowerCase().includes("na");
                if (this.esError && !this.mensajeResultado.toLowerCase().includes("revise los metadatos")) {
                  this.mensajeResultado += "\nRevise los metadatos";
                }
                this.resultado = null;
              }
            };
            reader.readAsText(blob);
            this.imageUrl = null;
            this.tableResult = null;
          }
        }, error => {
          console.error("Error al ejecutar el programa", error);
          this.procesarError(error);
        });
    }
  }

  private procesarError(error: any): void {
    if (error.error && typeof error.error === 'string') {
      this.mensajeResultado = error.error + "\nRevise los metadatos";
    } else {
      this.mensajeResultado = 'Programa no ejecutado, revise los datos de entrada\nRevise los metadatos';
    }
    this.esError = true;
  }

  cerrar(): void {
    this.router.navigate(['/programas']);
  }

  cerrarResultado(): void {
    this.resultado = null;
    this.imageUrl = null;
    this.tableResult = null;
    this.mensajeResultado = null;
    this.esError = false;
  }

  getTableHeaders(data: any[]): string[] {
    return data && data.length ? Object.keys(data[0]) : [];
  }

  getResultKeys(): string[] {
    return this.resultado ? Object.keys(this.resultado) : [];
  }

  getParamKeys(): string[] {
    return this.valores ? Object.keys(this.valores) : [];
  }
}
