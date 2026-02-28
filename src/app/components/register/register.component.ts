import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RegisterService } from '../../services/register/register.service';
import { RoleService } from '../../services/role/role.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})



export class RegisterComponent {

  form: FormGroup;
  type: string[] = [];
  googleSignedIn = false;
  successMsg = '';
  errorMsg = '';
  loading = false;

  private readonly GOOGLE_CLIENT_ID = '317678176933-3p8tu87ed84mt54c9esp1i2k87sgjkde.apps.googleusercontent.com';

  constructor(
    private fb: FormBuilder,
    private userAdminService: RegisterService,
    private roleService:RoleService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.form = this.fb.group({
      email:     [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName:  [{ value: '', disabled: true }, Validators.required],
      roleName:    ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    this.loadGoogleScript().then(() => this.initGoogleSignIn());
  }
  
  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      // Si ya está cargado, resuelve inmediatamente
      if (typeof (window as any)['google'] !== 'undefined') {
        resolve();
        return;
      }
  
      // Si el script ya existe en el DOM, espera a que dispare onload
      const existing = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
  
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }
  
      // Si no existe, lo inyecta dinámicamente
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  // ─── GOOGLE ───────────────────────────────────────────────────────────────

  private initGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: this.GOOGLE_CLIENT_ID,
      callback: (response: any) => this.handleGoogleCallback(response),
    });

    google.accounts.id.renderButton(
      document.getElementById('google-sign-in-btn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signup_with',
        locale: 'es',
        width: '100%',
      }
    );
  }

  private handleGoogleCallback(response: any): void {
    const payload = this.decodeJwt(response.credential);

    // Corre dentro de NgZone para que Angular detecte los cambios
    this.ngZone.run(() => {
      this.form.patchValue({
        email:     payload.email,
        firstName: payload.given_name,
        lastName:  payload.family_name,
      });
      this.googleSignedIn = true;
      this.errorMsg = '';
    });
  }

  /** Decodifica el payload del JWT de Google sin librerías externas */
  private decodeJwt(token: string): any {
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  // ─── ROLES ────────────────────────────────────────────────────────────────

  private loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (response) => (this.type = response.type), // <-- extrae el array
      error: () => (this.errorMsg = 'No se pudieron cargar los roles'),
    });
  }

  goHome(): void {
    this.router.navigate(['/home']); // ajusta la ruta según tu app
  }
  // ─── SUBMIT ───────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    // getRawValue() incluye los campos disabled (email, firstName, lastName)
    const payload = this.form.getRawValue();

    this.userAdminService.registerUserWithRole(payload).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.successMsg = res.successfulMessage;
          this.loading = false;
          this.resetForm();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.errorMsg =
            err?.error?.message ?? 'Ocurrió un error al registrar el usuario';
          this.loading = false;
        });
      },
    });
  }

 resetForm(): void {
    this.form.reset({ email: '', firstName: '', lastName: '', roleId: '' });
    this.googleSignedIn = false;
    // Vuelve a renderizar el botón de Google
    setTimeout(() => this.initGoogleSignIn(), 100);
  }

  // ─── HELPERS TEMPLATE ─────────────────────────────────────────────────────

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  ngOnDestroy(): void {
    // Limpia la sesión de Google Identity si el componente se destruye
    if (typeof google !== 'undefined') {
      google.accounts.id.cancel();
    }
  }
}
