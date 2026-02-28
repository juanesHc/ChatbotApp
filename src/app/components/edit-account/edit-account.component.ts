import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyAccountService } from '../../services/myaccount/myaccount.service';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.css'
})
export class EditAccountComponent implements OnInit {

  editForm: FormGroup;
  showConfirmModal = false;
  errorMessage = '';

  atLeastOneRequired(control: AbstractControl): ValidationErrors | null {
    const firstName = control.get('firstName')?.value?.trim();
    const lastName = control.get('lastName')?.value?.trim();
    if (!firstName && !lastName) {
      return { atLeastOneRequired: true };
    }
    return null;
  }

  constructor(
    private fb: FormBuilder,
    private myAccountService: MyAccountService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.minLength(3)],
      lastName:  ['', Validators.minLength(3)]
    }, { validators: this.atLeastOneRequired });
    
  }

  ngOnInit(): void {}

  openConfirmModal(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmUpdate(): void {
    const personId = this.loginService.getUserId();
    if (!personId) {
      this.errorMessage = 'No se pudo obtener el usuario autenticado.';
      this.showConfirmModal = false;
      return;
    }
  
    const rawValue = this.editForm.value;
    const updateUserAccountRequestDto: any = {};
    if (rawValue.firstName?.trim()) updateUserAccountRequestDto.firstName = rawValue.firstName.trim();
    if (rawValue.lastName?.trim())  updateUserAccountRequestDto.lastName  = rawValue.lastName.trim();
  
    this.myAccountService.updatePersonData(personId, updateUserAccountRequestDto).subscribe({
      next: () => {
        this.showConfirmModal = false;
        this.router.navigate(['/my-account']);
      },
      error: (err) => {
        this.errorMessage = 'No se pudo actualizar. Intenta de nuevo.';
        this.showConfirmModal = false;
        console.error(err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/my-account']);
  }

  isInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}