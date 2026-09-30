import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar class="dark-toolbar">
      <!-- Logo clickeable -->
      
      <a routerLink="/" class="dark-toolbar" class="logo" >
        <img (click)="logout()"src="favicon.ico" alt="Logo TFG" height="40">
      </a>
      <!-- Botones de navegación -->
      <div class="nav-buttons">
        <button mat-button routerLink="/programas" routerLinkActive="active-link">
          Gestión de Programas
        </button>
        <!-- Botón de Panel de Usuarios (solo visible para administradores) -->
        <button *ngIf="isAdmin()" mat-button routerLink="/panel-usuarios" routerLinkActive="active-link">
          Panel de Usuarios
        </button>
      </div>

      <span class="spacer"></span>

      <!-- Información del usuario y menú -->
      <div *ngIf="isLoggedIn(); else noUser" class="user-info">
        <span class="username">{{ currentUser }}</span>
        <button mat-icon-button class="user-menu-button" [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">Cerrar sesión</button>
        </mat-menu>
      </div>
      <ng-template #noUser>
        <button mat-button routerLink="/">Iniciar sesión</button>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`
            
    .dark-toolbar {
      background-color: #1a1a1a;
      color: #fff;
    }
    .user-menu-button {
      width: 40px;  /* Tamaño fijo del círculo */
      height: 40px;
      border: 2px solid rgba(255, 235, 59, 0.8); /* Rebordo sutil */
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      box-sizing: border-box;
    }

    .user-menu-button mat-icon {
      font-size: 25px;  /* Ajusta este valor para que el ícono llene el círculo */
      
    }

    .logo {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      text-decoration: none;
    }
    .logo img {
      display: block;
    }
    .nav-buttons button {
      margin-right: 1rem;
      color: #fff;
    }
    .active-link {
      border: 2px solid #ffeb3b;
      font-weight: bold;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-info {
      display: flex;
      align-items: center;
    }
    .username {
      font-size: 1.2rem;
      font-weight: bold;
      margin-right: 8px;
      color: #fff;
    }
  `]
})
export class NavbarComponent {
  currentUser: string = '';

  constructor(private router: Router, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  isLoggedIn(): boolean {
    return !!this.authService.getToken();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  private dynamicPort: number = environment.apiDefaultPort;

  logout(): void {
    this.dynamicPort= environment.apiDefaultPort;
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
