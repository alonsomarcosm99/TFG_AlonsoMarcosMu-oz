import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card custom-shadow">
        <mat-card-header class="header-container">
          <div class="header-content">
            <mat-card-title class="register-title">Registrar Nuevo Usuario</mat-card-title>
          </div>
        </mat-card-header>
        <mat-card-content>
          <!-- Spinner mientras se realiza el registro -->
          <div *ngIf="loading" class="spinner-container">
            <mat-spinner></mat-spinner>
            <p>Cargando...</p>
          </div>
          <!-- Formulario solo se muestra si no se está cargando -->
          <form *ngIf="!loading" (ngSubmit)="register()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput [(ngModel)]="usuario" name="usuario" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [(ngModel)]="contrasena" name="contrasena" type="password" required>
            </mat-form-field>
            <mat-checkbox [(ngModel)]="esAdmin" name="esAdmin">Registrar como Administrador</mat-checkbox>
            <div class="button-container">
              <button mat-raised-button color="primary" type="submit">Registrar</button>
            </div>
          </form>
          <p class="message" *ngIf="mensaje">{{ mensaje }}</p>
          <div class="button-container">
            <button mat-button (click)="volver()">Volver a Log In</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f0f0f0, #dcdcdc);
    }
    .register-card {
      width: 400px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }
    .custom-shadow {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25) !important;
    }
    .header-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0;
      margin: 0;
      width: 100%;
      background-color: transparent;
    }
    .header-content {
      width: 100%;
      text-align: center;
    }
    .register-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    .button-container {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }
    .message {
      text-align: center;
      margin-top: 1rem;
      color: green;
    }
    .spinner-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 150px;
    }
  `]
})
export class RegisterComponent {
  usuario: string = '';
  contrasena: string = '';
  esAdmin: boolean = false;
  mensaje: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.loading = true;
    this.authService.register(this.usuario, this.contrasena, this.esAdmin).subscribe(response => {
      if (response.status && response.status[0] === 'success') {
        this.mensaje = response.message ? response.message[0] : 'Usuario creado exitosamente.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      } else {
        this.mensaje = 'Error al registrar el usuario.';
        this.loading = false;
      }
    }, error => {
      console.error('Error en registro:', error);
      this.mensaje = 'Error al registrar el usuario.';
      this.loading = false;
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}
