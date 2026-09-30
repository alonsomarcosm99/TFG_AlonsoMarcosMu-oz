import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.authService.getToken()) {
      return of(true);
    } else {
      // Redirige al login si no hay token
      this.router.navigate(['/']);
      return of(false);
    }
  }
}
