import { Component } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  rol: string | null = null;
  isAdmin = false;

  constructor(private authService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();
    this.isAdmin = this.rol === 'ROLE_ADMIN'; 
  }

  retrieveUsers(): void {
    this.router.navigate(['/retrieve-users']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  myaccount(): void{
    this.router.navigate(['/my-account']);
  }

  notification():void{
    this.router.navigate(['notification']);
  }
}
