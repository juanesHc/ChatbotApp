export interface RetrieveMyNotificationResponseDto {
  notificationId: string;
  subject: string;
  message: string;
  read: boolean;
  senderName: string;
  senderId: string;
}
  export interface EliminationNotificationResponseDto {
    successfulMessage: string;
  }

  export interface RegisterNotificationRequestDto {
    senderId: string; 
    subject: string;
    messageDescription: string;
  }

  export interface RegisterAdminNotificationResponseDto {
    successfulMessage: string;
  }
  