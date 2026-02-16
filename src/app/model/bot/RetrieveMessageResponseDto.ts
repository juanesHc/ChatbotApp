export interface RetrieveMessageResponseDto {
    id: string;
    content: string;
    type: 'PERSON' | 'BOT';
    timestamp: string;
  }