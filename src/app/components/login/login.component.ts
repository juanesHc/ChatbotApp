import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];
  
      if (token) {
        this.authService.saveToken(token);
        this.router.navigate(['/userhome']);

      }
  
      if (error) {
        this.errorMessage = 'No se pudo iniciar sesión con Google. Intenta de nuevo.';
      }
    });
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.loginWithGoogle();
  }
}