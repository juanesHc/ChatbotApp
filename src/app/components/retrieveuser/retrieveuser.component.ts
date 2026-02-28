import { Component, OnDestroy, OnInit } from '@angular/core';
import { PagedUsersResponse, RetrieveUsersFilterRequest, UsersPageParams, UserSummary } from '../../model/person/retrieveuser/RetrieveUsersFilterRequestDto';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PersonService } from '../../services/person/person.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RoleService } from '../../services/role/role.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retrieveuser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './retrieveuser.component.html',
  styleUrl: './retrieveuser.component.css'
})
export class RetrieveuserComponent implements OnInit, OnDestroy {

  roles: string[] = [];

  pagedUsers: PagedUsersResponse | null = null;
  loading = false;
  error: string | null = null;
  showFilters = false;

  filterForm: FormGroup;

  readonly sizeOptions = [5, 10, 20, 50];

  pagination: UsersPageParams = {
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDir: 'desc',
  };

  readonly sortableColumns = [
    { key: 'givenName',  label: 'Nombre' },
    { key: 'familyName', label: 'Apellido' },
    { key: 'email',      label: 'Email' },
    { key: 'roleEntity', label: 'Rol' },
    { key: 'createdAt',  label: 'Fecha de registro' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private usersService: PersonService,
    private roleService: RoleService,
    private router:Router
  ) {
    this.filterForm = this.fb.group({
      givenName:  [''],
      familyName: [''],
      email:      [''],
      roleName:   [''],
      sourceDate: [''],
      targetDate: [''],
    });
  }

  goHome(): void {
    this.router.navigate(['/home']); // ajusta la ruta según tu app
  }



goToSendNotification(personId: string): void {
  this.router.navigate(['/send-notification', personId]);
}

  ngOnInit(): void {

    // 🔹 Cargar roles desde backend
    this.roleService.getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.roles = response.type;
        },
        error: (err) => {
          console.error('Error cargando roles', err);
        }
      });

    // 🔹 Escuchar cambios de filtros
    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pagination.page = 0;
        this.loadUsers();
      });

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    const filter: RetrieveUsersFilterRequest = this.filterForm.value;

    this.usersService.retrieveUsers(filter, this.pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pagedUsers = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudieron cargar los usuarios.';
          this.loading = false;
          console.error(err);
        },
      });
  }

  goToPage(page: number): void {
    if (!this.pagedUsers) return;
    if (page < 0 || page >= this.pagedUsers.totalPages) return;

    this.pagination.page = page;
    this.loadUsers();
  }

  onSizeChange(size: number): void {
    this.pagination.size = size;
    this.pagination.page = 0;
    this.loadUsers();
  }

  sortBy(column: string): void {
    if (this.pagination.sortBy === column) {
      this.pagination.sortDir =
        this.pagination.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.pagination.sortBy = column;
      this.pagination.sortDir = 'asc';
    }

    this.pagination.page = 0;
    this.loadUsers();
  }

  getSortIcon(column: string): string {
    if (this.pagination.sortBy !== column) return '↕';
    return this.pagination.sortDir === 'asc' ? '↑' : '↓';
  }

  isSortActive(column: string): boolean {
    return this.pagination.sortBy === column;
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.pagination.page = 0;
    this.loadUsers();
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.filterForm.value)
      .some(v => v !== '' && v !== null);
  }

  getPagesArray(): number[] {
    if (!this.pagedUsers) return [];

    const total = this.pagedUsers.totalPages;
    const current = this.pagedUsers.page;
    const range: number[] = [];

    for (let i = Math.max(0, current - 2);
         i <= Math.min(total - 1, current + 2);
         i++) {
      range.push(i);
    }

    return range;
  }

  getInitials(user: UserSummary): string {
    return (
      (user.givenName?.charAt(0) ?? '') +
      (user.familyName?.charAt(0) ?? '')
    ).toUpperCase() || '?';
  }

  trackByUser(_: number, user: UserSummary): string {
    return user.email;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}