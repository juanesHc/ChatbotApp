import { Component } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  rol: string | null = null;
  isAdmin = false;
  unreadCount: number = 0;

  constructor(private authService: LoginService, private router: Router, private notificationService:NotificationService) {}

  ngOnInit(): void {
    this.rol = this.authService.getRol();
    this.isAdmin = this.rol === 'ROLE_ADMIN'; 
    this.loadUnreadCount();
  }

  retrieveUsers(): void {
    this.router.navigate(['/retrieve-users']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUnreadCount(): void {
    const personId = this.authService.getUserId();
    if (!personId) return;

    this.notificationService.getNotifications(personId).subscribe({
      next: (notifications) => {
        this.unreadCount = notifications.filter(n => !n.read).length;
      },
      error: () => this.unreadCount = 0
    });
  }

  myaccount(): void{
    this.router.navigate(['/my-account']);
  }

  notification():void{
    this.router.navigate(['notification']);
  }
}
