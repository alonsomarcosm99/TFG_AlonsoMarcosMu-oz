import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card custom-shadow">
        <mat-card-header class="header-container">
          <div class="header-content">
            <mat-card-title class="login-title">Iniciar Sesión</mat-card-title>
          </div>
        </mat-card-header>
        <mat-card-content>
          <p class="demo-note" *ngIf="demoMode">
            Publicación de portfolio: las credenciales están precargadas y todas las operaciones son simuladas.
          </p>
          <form (ngSubmit)="login()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Usuario</mat-label>
              <input matInput [(ngModel)]="usuario" name="usuario" required>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [(ngModel)]="contrasena" name="contrasena" type="password" required>
            </mat-form-field>
            <div class="button-container">
              <button mat-raised-button color="primary" type="submit">Iniciar Sesión</button>
            </div>
          </form>
          <p class="error-message" *ngIf="errorMessage">{{ errorMessage }}</p>
          <p class="register-link">
            ¿No tienes cuenta? <a routerLink="/register">Registrar nuevo usuario</a>
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f0f0f0, #dcdcdc);
    }
    .login-card {
      width: 400px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }
    .custom-shadow {
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25) !important;
    }
    /* Ajustamos el header para que no sobresalga y el título quede centrado */
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
    .login-title {
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
    .error-message {
      color: red;
      text-align: center;
      margin-top: 1rem;
    }
    .register-link {
      text-align: center;
      margin-top: 1rem;
    }
    .register-link a {
      text-decoration: none;
      color: #3f51b5;
      font-weight: bold;
    }
    .demo-note {
      color: #284b63;
      background: #e9f5ff;
      border-left: 4px solid #1976d2;
      padding: 0.75rem;
    }
  `]
})
export class LoginComponent {
  readonly demoMode = environment.demoMode;
  usuario: string = environment.demoMode ? 'demo-admin' : '';
  contrasena: string = environment.demoMode ? 'portfolio' : '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: () => this.router.navigate(['/programas']),
      error: () => {
        this.errorMessage = 'Credenciales inválidas o error en la autenticación';
      }
    });
  }
}
