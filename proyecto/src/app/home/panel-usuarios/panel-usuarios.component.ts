import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface UsuarioActivo {
  usuario: string;
  puerto: string | null;
}

@Component({
  selector: 'app-panel-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatListModule],
  template: `
    <div class="container">
      <h2>Panel de Usuarios Activos</h2>
      <mat-list>
        <mat-list-item *ngFor="let user of usuarios">
          <mat-icon style="color: green; margin-right: 8px;">fiber_manual_record</mat-icon>
          <span>{{ user.usuario }} (Puerto: {{ user.puerto ? user.puerto : 'N/A' }})</span>
          <span class="spacer"></span>
          <button mat-button color="warn" (click)="cerrarSesion(user.usuario)">Cerrar Sesión</button>
        </mat-list-item>
      </mat-list>
      <p *ngIf="usuarios.length === 0">No hay usuarios activos.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 1rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class PanelUsuariosComponent implements OnInit {
  usuarios: UsuarioActivo[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.http.get<any[]>('http://localhost:7617/usuariosactivos')
      .subscribe(response => {
        // Mapea la respuesta para extraer el primer elemento de cada array
        this.usuarios = response.map(item => ({
          usuario: item.usuario[0],
          puerto: item.puerto[0]  // Puede ser null
        }));
      }, error => {
        console.error('Error al cargar usuarios activos', error);
      });
  }

  cerrarSesion(usuario: string): void {
    const params = new HttpParams().set('usuario', usuario);
    this.http.get<any>('http://localhost:7617/cerrarsesion', { params })
      .subscribe(response => {
        console.log(`Sesión cerrada para ${usuario}`, response);
        // Recarga la lista de usuarios activos
        this.cargarUsuarios();
      }, error => {
        console.error(`Error al cerrar sesión de ${usuario}`, error);
      });
  }
}
