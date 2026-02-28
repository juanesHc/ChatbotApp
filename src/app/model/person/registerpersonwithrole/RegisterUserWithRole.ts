export interface RegisterUserWithRoleRequestDto {
    email: string;
    firstName: string;
    lastName: string;
    roleName: string; 
  }
  
  
  export interface RegisterUserWithRoleResponseDto {
    successfulMessage: string; 
  }