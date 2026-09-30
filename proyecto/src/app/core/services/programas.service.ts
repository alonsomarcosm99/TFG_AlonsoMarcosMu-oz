import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramasService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Método auxiliar para construir la URL completa con el puerto dinámico.
   * Se usa en cada llamada para garantizar que siempre se use el puerto actualizado.
   */
  private getDynamicUrl(path: string): string {
    return `http://${environment.apiHost}:${this.authService.getDynamicPort()}${path}`;
  }

  /**
   * Lista los programas disponibles.
   */
  listarProgramas(): Observable<any[]> {
    return this.http.get<any[]>(this.getDynamicUrl('/programasinfo'));
  }

  /**
   * Realiza una petición POST para refrescar la información.
   */
  refresh(): Observable<any> {
    return this.http.post<any>(this.getDynamicUrl('/refresh'), {});
  }

  /**
   * Ejecuta un programa y devuelve la información para la tabla.
   */
  ejecutarProgramaTable(id: string, parametros: any): Observable<any> {
    let params = new HttpParams().set('programa', id);
    Object.keys(parametros).forEach(key => {
      params = params.set(key, parametros[key]);
    });
    return this.http.get<any>(this.getDynamicUrl('/ejecutar'), { params });
  }

  /**
   * Ejecuta un programa y descarga el resultado como blob.
   */
  ejecutarPrograma(id: string, parametros: any): Observable<any> {
    let params = new HttpParams().set('programa', id);
    Object.keys(parametros).forEach(key => {
      params = params.set(key, parametros[key]);
    });
    return this.http.get(this.getDynamicUrl('/ejecutar'), { params, responseType: 'blob' });
  }

  /**
   * Sube un archivo al servidor.
   */
  uploadPrograma(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<HttpEvent<any>>(this.getDynamicUrl('/upload'), formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  /**
   * Elimina un programa mediante su nombre de archivo.
   */
  eliminarPrograma(filename: string): Observable<any> {
    return this.http.delete<any>(`${this.getDynamicUrl('/delete')}?filename=${encodeURIComponent(filename)}`);
  }

  private programasCache: any[] = [];

  /**
   * Busca y retorna un programa por su ID, usando una caché local.
   */
  getProgramaById(id: string): any {
    return this.programasCache.find(p => (Array.isArray(p.id) ? p.id[0] === id : p.id === id));
  }
}
