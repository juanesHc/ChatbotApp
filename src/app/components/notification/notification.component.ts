import { Component, OnInit } from '@angular/core';
import { RetrieveMyNotificationResponseDto } from '../../model/notification/NotificationDto';
import { LoginService } from '../../services/login/login.service';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {


  
  notifications: RetrieveMyNotificationResponseDto[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  deletingId: string | null = null;

  showSuccessModal: boolean = false;
  successMessage: string = '';

  constructor(
    private notificationService: NotificationService,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.notificationId === notificationId);
        if (notification) notification.read = true;
      },
      error: (error) => console.error('Error al marcar como leída:', error)
    });
  }

  goHome(): void {
    this.router.navigate(['/home']); // ajusta la ruta según tu app
  }

  loadNotifications(): void {
    const personId = this.loginService.getUserId();

    if (!personId) {
      this.errorMessage = 'No se pudo obtener el usuario';
      this.isLoading = false;
      return;
    }
  
    this.isLoading = true;
    this.notificationService.getNotifications(personId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar notificaciones:', error);
        this.errorMessage = 'No se pudieron cargar las notificaciones';
        this.isLoading = false;
      }
    });
  }

  deleteNotification(notificationId: string): void {
    this.deletingId = notificationId;

    this.notificationService.deleteNotification(notificationId).subscribe({
      next: (response) => {
        this.notifications = this.notifications.filter(n => n.notificationId !== notificationId);
        this.deletingId = null;
        this.showSuccessMessage(response.successfulMessage);
      },
      error: (error) => {
        console.error('Error al eliminar notificación:', error);
        this.deletingId = null;
      }
    });
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = '';
  }
}
