import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';


export const DEMO_PROGRAMS = [
  {
    id: ['resumen_clientes'],
    nombre_programa: ['Resumen de clientes'],
    nombre_archivo: ['resumen_clientes.R'],
    proposito: ['Genera una tabla agregada por segmento de cliente.'],
    parametros: ['limite'],
    defaults: { limite: ['100'] },
    prefill: true,
    metodo: ['Agregación y resumen descriptivo con R.'],
    resultado_esperado: ['Tabla con clientes, gasto medio y retención.'],
    analisis_resultado: ['Permite comparar el comportamiento por segmento.'],
    mensaje: ['Programa versionado y validado en el TFG.'],
    tipo: ['table'],
  },
  {
    id: ['estadisticas_ventas'],
    nombre_programa: ['Estadísticas de ventas'],
    nombre_archivo: ['estadisticas_ventas.R'],
    proposito: ['Calcula indicadores descriptivos sobre una muestra de ventas.'],
    parametros: ['periodo', 'region'],
    defaults: { periodo: ['2025'], region: ['Centro'] },
    prefill: true,
    metodo: ['Estadística descriptiva.'],
    resultado_esperado: ['Media, mediana, desviación y registros procesados.'],
    analisis_resultado: ['Resume la distribución de ventas de la muestra.'],
    mensaje: ['La publicación devuelve un resultado congelado y no ejecuta R.'],
    tipo: ['json'],
  },
];

function response(body: unknown, status = 200): Observable<HttpEvent<unknown>> {
  return of(new HttpResponse({ body, status })).pipe(delay(120));
}

function executeResponse(request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
  const programId = request.params.get('programa');
  if (programId === 'resumen_clientes') {
    return response([
      { segmento: 'Pyme', clientes: 42, gasto_medio: 1840, retencion: '91 %' },
      { segmento: 'Empresa', clientes: 18, gasto_medio: 6230, retencion: '96 %' },
      { segmento: 'Particular', clientes: 40, gasto_medio: 690, retencion: '84 %' },
    ]);
  }
  const payload = {
    mensaje: ['Estadísticas calculadas en modo de solo lectura.'],
    resultados: {
      registros_procesados: [1250],
      media_ventas: [2184.35],
      mediana_ventas: [1976.8],
      desviacion_estandar: [483.12],
    },
  };
  return request.responseType === 'blob'
    ? response(new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    : response(payload);
}

export const demoInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  let path: string;
  try {
    path = new URL(request.url, window.location.origin).pathname;
  } catch {
    return next(request);
  }

  switch (path) {
    case '/iniciarsesion':
      return response({ status: ['success'], token: ['portfolio-read-only'] });
    case '/esAdmin':
      return response([true]);
    case '/lanzarapi':
      return response({ status: ['success'], puerto: [7617] });
    case '/crearusuarioadmin':
    case '/crearusuarionoadmin':
      return response({ status: ['success'], message: ['Usuario simulado; no se ha persistido ningún dato.'] });
    case '/programasinfo':
      return response(DEMO_PROGRAMS);
    case '/refresh':
      return response({ status: ['success'] });
    case '/ejecutar':
      return executeResponse(request);
    case '/upload':
      return response({ status: ['success'], message: ['Carga simulada; el archivo no se ha enviado.'] });
    case '/delete':
      return response({ status: ['deleted'], file: [request.params.get('filename') ?? 'programa.R'] });
    case '/usuariosactivos':
      return response([
        { usuario: ['demo-admin'], puerto: ['7618'] },
        { usuario: ['analista'], puerto: ['7619'] },
      ]);
    case '/cerrarsesion':
      return response({ status: ['success'] });
    default:
      return throwError(
        () => new HttpErrorResponse({ status: 404, statusText: 'Endpoint no simulado', url: request.url }),
      );
  }
};
