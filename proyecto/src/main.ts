import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/core/app.component';
import { routes } from './app/core/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { demoInterceptor } from './app/core/demo.interceptor';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, ...(environment.demoMode ? [withHashLocation()] : [])),
    provideHttpClient(
      environment.demoMode ? withInterceptors([demoInterceptor]) : withInterceptorsFromDi(),
    ),
    provideAnimationsAsync(),
  ]
});
