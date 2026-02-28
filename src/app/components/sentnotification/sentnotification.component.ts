import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-sentnotification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sentnotification.component.html',
  styleUrl: './sentnotification.component.css'
})
export class SentnotificationComponent implements OnInit{
  personId: string = '';
  subject: string = '';
  messageDescription: string = '';
  isSending: boolean = false;

  sentAt: Date = new Date();

  showSuccessModal: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationSendService: RegisterService
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('personId') || '';
  }

  sendNotification(): void {
    if (!this.subject.trim() || !this.messageDescription.trim()) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.errorMessage = '';
    this.isSending = true;
    this.sentAt = new Date();

    this.notificationSendService.sendNotification(this.personId, {
      subject: this.subject,
      messageDescription: this.messageDescription
    }).subscribe({
      next: (response) => {
        this.isSending = false;
        this.showSuccessModal = true;
        this.successMessage = response.successfulMessage;
      },
      error: () => {
        this.isSending = false;
        this.errorMessage = 'Error al enviar la notificación';
      }
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/retrieve-users']);
  }

  goBack(): void {
    this.router.navigate(['/retrieve-users']);
  }

  get formattedDate(): string {
    return this.sentAt.toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  get formattedTime(): string {
    return this.sentAt.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit'
    });
  }
}
