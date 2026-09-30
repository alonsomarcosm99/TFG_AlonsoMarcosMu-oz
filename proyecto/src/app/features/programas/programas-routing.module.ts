import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProgramasComponent } from './lista-programas/lista-programas.component';
import { AgregarProgramaComponent } from './agregar-programa/agregar-programa.component';
import { EjecutarProgramaComponent } from './ejecutar-programa/ejecutar-programa.component';
import { EliminarProgramaComponent } from './eliminar-programa/eliminar-programa.component';

const routes: Routes = [
  { path: '', component: ListaProgramasComponent },  // Cuando navegas a '/programas'
  { path: 'agregar', component: AgregarProgramaComponent },
  { path: 'ejecutar/:id', component: EjecutarProgramaComponent },
  { path: 'eliminar/:id', component: EliminarProgramaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramasRoutingModule {}
