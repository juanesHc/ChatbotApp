export interface RetrieveMyNotificationResponseDto {
    subject:string
    notificationId: string;
    message: string;
    read: boolean;
  }
  
  export interface EliminationNotificationResponseDto {
    successfulMessage: string;
  }

  export interface RegisterNotificationRequestDto {
    subject: string;
    messageDescription: string;
  }
  
  export interface RegisterAdminNotificationResponseDto {
    successfulMessage: string;
  }
  