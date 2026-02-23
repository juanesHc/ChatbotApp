import { Injectable } from '@angular/core';

export interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
}

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
  ) {}


  set(name: string, value: string, options: CookieOptions = {}): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;


    if (options.expires) {
      let expires: Date;

      if (typeof options.expires === 'number') {
        expires = new Date();
        expires.setTime(expires.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        expires = options.expires;
      }

      cookieString += `; expires=${expires.toUTCString()}`;
    }

    cookieString += `; path=${options.path || '/'}`;


    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }


    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  }


  get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = cookie.substring(nameEQ.length);
        return decodeURIComponent(value);
      }
    }

    return null;
  }


  check(name: string): boolean {
    return this.get(name) !== null;
  }


  delete(name: string, path: string = '/', domain?: string): void {
    if (this.check(name)) {
      this.set(name, '', {
        expires: new Date('1970-01-01'),
        path,
        domain
      });
    }
  }


  getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const cookieArray = document.cookie.split(';');

    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      const [name, value] = cookie.split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }


  deleteAll(path: string = '/', domain?: string): void {
    const cookies = this.getAll();
    for (const name in cookies) {
      this.delete(name, path, domain);
    }
  }


  setToken(token: string, rememberMe: boolean = false): void {
    const expirationDays = rememberMe ? 7 : 1;

    this.set(this.TOKEN_KEY, token, {
      expires: expirationDays,
      path: '/',
      secure: false,
      sameSite: 'Strict'
    });

    console.log(`Token guardado en cookie (expira en ${expirationDays} día(s))`);
  }


  getToken(): string | null {
    return this.get(this.TOKEN_KEY);
  }


  deleteToken(): void {
    this.delete(this.TOKEN_KEY);
    console.log('Token eliminado de la cookie');
  }


  hasToken(): boolean {
    return this.check(this.TOKEN_KEY);
  }


}