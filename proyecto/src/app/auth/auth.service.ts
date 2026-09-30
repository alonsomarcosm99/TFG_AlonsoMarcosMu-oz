import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Se mantiene la misma estructura, pero se usará host.docker.internal junto con el puerto dinámico.
  private baseUrl: string = ''; // En este caso, se construyen las URLs usando el puerto dinámico.
  
  // Duración de la sesión en milisegundos (por ejemplo, 30 minutos)
  private SESSION_DURATION = 30 * 60 * 1000;

  constructor(private http: HttpClient) {}

  /**
   * Helper para construir la URL completa usando el puerto dinámico.
   */
  private dynamicPort: number = environment.apiDefaultPort;

  private buildUrl(path: string): string {
    return `http://${environment.apiHost}:${this.dynamicPort}${path}`;
  }

  /**
   * Login: envía usuario y contraseña mediante POST a "/iniciarsesion".
   * Si es exitoso, guarda el token y otros datos en localStorage, verifica si es admin y lanza la API.
   */
  login(usuario: string, contrasena: string): Observable<any> {
    let params = new HttpParams()
      .set('usuario', usuario)
      .set('contrasena', contrasena);
    // Se usa la URL construida con el puerto dinámico (inicialmente 7617)
    const url = this.buildUrl('/iniciarsesion');
    return this.http.post<any>(url, null, { params }).pipe(
      switchMap(response => {
        if (response.status && response.status[0] === 'success') {
          const token = response.token ? response.token[0] : '';
          // Guardar el token y su fecha de expiración en localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiry', (Date.now() + this.SESSION_DURATION).toString());
          localStorage.setItem('currentUser', usuario);
          // Verificar rol admin y guardar en localStorage
          return this.checkIsAdmin(usuario).pipe(
            tap(isAdmin => {
              localStorage.setItem('isAdmin', isAdmin.toString());
            }),
            switchMap(() => this.lanzarApi(usuario))
          );
        } else {
          return throwError('Credenciales inválidas');
        }
      }),
      catchError(err => {
        console.error('Error en login:', err);
        return throwError(err);
      })
    );
  }

  /**
   * Lanza la API para el usuario mediante GET a "/lanzarapi" y actualiza dynamicPort.
   */
  lanzarApi(usuario: string): Observable<any> {
    let params = new HttpParams().set('usuarioexterno', usuario);
    const url = this.buildUrl('/lanzarapi');
    return this.http.get<any>(url, { params }).pipe(
      tap(response => {
        if (response.status && response.status[0] === 'success') {
          this.dynamicPort = response.puerto ? response.puerto[0] : 7617;
          console.log('Puerto dinámico actualizado:', this.dynamicPort);
        } else {
          console.error('Error al lanzar API:', response.message);
        }
      }),
      catchError(err => {
        console.error('Error en lanzarApi:', err);
        return throwError(err);
      })
    );
  }

  /**
   * Verifica si el usuario es administrador usando el endpoint "/esAdmin".
   * Retorna un Observable con true o false.
   */
  checkIsAdmin(usuario: string): Observable<boolean> {
    const url = this.buildUrl('/esAdmin');
    let params = new HttpParams().set('usuario', usuario);
    return this.http.get<boolean[]>(url, { params }).pipe(
      map(response => response[0] === true),
      catchError(err => {
        console.error('Error al verificar rol admin:', err);
        return of(false);
      })
    );
  }

  /**
   * Registra un nuevo usuario usando POST.
   * Si esAdmin es true, usa el endpoint "/crearusuarioadmin", de lo contrario "/crearusuarionoadmin".
   */
  register(usuario: string, contrasena: string, esAdmin: boolean): Observable<any> {
    const endpoint = esAdmin ? '/crearusuarioadmin' : '/crearusuarionoadmin';
    const url = this.buildUrl(endpoint);
    const body = { usuario, contrasena };
    return this.http.post<any>(url, body);
  }

  /**
   * Logout: Llama al endpoint de cierre de sesión y limpia los datos de la sesión en localStorage.
   */
  logout(): Observable<any> {
    this.dynamicPort= environment.apiDefaultPort;
    const url = this.buildUrl('/cerrarsesion');
    let params = new HttpParams().set('usuario', this.getCurrentUser());
    return this.http.get<any>(url, { params }).pipe(
      tap(response => {
        console.log('Logout response:', response);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAdmin');
      }),
      catchError(err => {
        console.error('Error en logout:', err);
        return throwError(err);
      })
    );
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Devuelve el token si existe y no ha expirado; de lo contrario, limpia la sesión y retorna null.
   */
  getToken(): string | null {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('tokenExpiry');
    if (token && expiry && parseInt(expiry) > Date.now()) {
      return token;
    } else {
      this.logout();
      return null;
    }
  }

  getCurrentUser(): string {
    return localStorage.getItem('currentUser') || '';
  }

  /**
   * Devuelve el puerto dinámico actual asignado al backend.
   */
  getDynamicPort(): number {
    return this.dynamicPort;
  }

  /**
   * Devuelve true si el usuario es administrador según lo almacenado en localStorage.
   */
  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true';
  }
}
