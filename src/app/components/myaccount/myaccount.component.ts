import { Component } from '@angular/core';
import { MyAccountService } from '../../services/myaccount/myaccount.service';
import { RetrievePersonDataResponseDto } from '../../model/person/myaccount/RetrievePersonDataResponseDto';
import { LoginService } from '../../services/login/login.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './myaccount.component.html',
  styleUrl: './myaccount.component.css'
})
export class MyaccountComponent {
  personData: RetrievePersonDataResponseDto | null = null;
  isLoading = false;
  errorMessage = '';
  showDeleteModal = false;
  operationError = '';  
  // para errores de delete, update, etc.

  constructor(private myAccountService: MyAccountService, 
    private loginService: LoginService,
  private router: Router) {}

  ngOnInit(): void {
    this.loadPersonData();
  }

  get formattedLastUpdate(): string {
    if (!this.personData?.lastUpdate) return '—';
  
    return `${this.personData.lastUpdate}`;
  }

  loadPersonData(): void {
    const personId = this.loginService.getUserId(); 

    if (!personId) {
      this.errorMessage = 'No se pudo obtener el usuario autenticado.';
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
  
    this.myAccountService.getPersonData(personId).subscribe({
      next: (data) => {
        this.personData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar la información del perfil.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get fullName(): string {
    if (!this.personData) return '';
    return `${this.personData.firstName} ${this.personData.lastName}`;
  }

  get initials(): string {
    if (!this.personData) return '';
    return `${this.personData.firstName.charAt(0)}${this.personData.lastName.charAt(0)}`.toUpperCase();
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }
  
  closeModal(): void {
    this.showDeleteModal = false;
  }
  
  deleteAccount(): void {
    const personId = this.loginService.getUserId();
    if (!personId) {
      this.operationError = 'No se pudo obtener el usuario autenticado.'; // ← cambio
      this.showDeleteModal = false;
      return;
    }
  
    this.myAccountService.deletePersonData(personId).subscribe({
      next: () => {
        this.loginService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.operationError = 'No se pudo eliminar la cuenta. Intenta de nuevo.'; // ← cambio
        this.showDeleteModal = false;
        console.error(err);
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']); // ajusta la ruta según tu app
  }

  goToEdit(): void {
    this.router.navigate(['/edit-account']);
  }

}
