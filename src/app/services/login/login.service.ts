import { Injectable } from '@angular/core';
import { CookieService } from '../cookie/cookie.service';


@Injectable({ providedIn: 'root' })
export class LoginService {

  constructor(
    private cookieService: CookieService
  ) {}

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  saveToken(token: string): void {
    this.cookieService.setToken(token);
  }

  getToken(): string | null {
    return this.cookieService.getToken();
  }

  logout(): void {
    this.cookieService.deleteToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken();
    if (decoded?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    }
    return true;
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    return this.decodeToken().id || null;
  }

  getUserName(): string {
    return this.decodeToken().name;
  }

  getRol(): string | null {
    return this.decodeToken().role || null;
  }

}