import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramasRoutingModule } from './programas-routing.module'; // Asegúrate de importarlo
import { ListaProgramasComponent } from './lista-programas/lista-programas.component';
import { AgregarProgramaComponent } from './agregar-programa/agregar-programa.component';
import { EjecutarProgramaComponent } from './ejecutar-programa/ejecutar-programa.component';
import { EliminarProgramaComponent } from './eliminar-programa/eliminar-programa.component';

@NgModule({
  imports: [
    CommonModule,
    ProgramasRoutingModule,  // IMPORTANTE: este módulo define las rutas internas
    ListaProgramasComponent,
    AgregarProgramaComponent,
    EjecutarProgramaComponent,
    EliminarProgramaComponent
  ]
})
export class ProgramasModule { }
