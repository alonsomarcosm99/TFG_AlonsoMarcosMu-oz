import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { AuthGuard } from './auth.guard';
import { PublicLayoutComponent } from '../layout/public-layout/public-layout.component';
import { AuthLayoutComponent } from '../layout/auth-layout/auth-layout.component';
import { PanelUsuariosComponent } from '../home/panel-usuarios/panel-usuarios.component';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'programas', 
        loadChildren: () => import('../features/programas/programas.module').then(m => m.ProgramasModule)
      },
      { path: 'panel-usuarios', component: PanelUsuariosComponent },
      
    ]
  },
  { path: '**', redirectTo: '' }
];
