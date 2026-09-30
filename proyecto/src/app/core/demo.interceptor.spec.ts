import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';

import { DEMO_PROGRAMS, demoInterceptor } from './demo.interceptor';


describe('demoInterceptor', () => {
  it('devuelve el catálogo congelado sin llamar al backend', (done) => {
    const request = new HttpRequest('GET', 'http://localhost:7617/programasinfo');

    demoInterceptor(request, () => {
      fail('No debe delegar una ruta simulada');
      throw new Error('Delegación inesperada');
    }).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.body).toEqual(DEMO_PROGRAMS);
        done();
      }
    });
  });

  it('simula el login y no persiste credenciales reales', (done) => {
    const request = new HttpRequest('POST', 'http://localhost:7617/iniciarsesion', null);

    demoInterceptor(request, () => {
      fail('No debe delegar el login simulado');
      throw new Error('Delegación inesperada');
    }).subscribe((event) => {
      if (event instanceof HttpResponse) {
        expect(event.body).toEqual({ status: ['success'], token: ['portfolio-read-only'] });
        done();
      }
    });
  });

  it('rechaza endpoints que no forman parte del contrato', (done) => {
    const request = new HttpRequest('GET', 'http://localhost:7617/no-existe');

    demoInterceptor(request, () => {
      fail('No debe delegar una ruta no permitida en modo demo');
      throw new Error('Delegación inesperada');
    }).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        done();
      },
    });
  });
});
