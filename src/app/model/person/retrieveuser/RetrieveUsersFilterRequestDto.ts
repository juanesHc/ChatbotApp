export interface RetrieveUsersFilterRequest {
  givenName?: string;
  familyName?: string;
  email?: string;
  roleName?: string;
  createdAt?: string;
  sourceDate?: string;
  targetDate?: string;
}

export interface UserSummary {
  personId: string;
  givenName: string;
  familyName: string;
  email: string;
  roleName: string;
  createdAt: string;
}

export interface PagedUsersResponse {
  content: UserSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UsersPageParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}