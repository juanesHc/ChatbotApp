import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/chats/chats.service';
import { RegisterMessageRequestDto } from '../../model/bot/RegisterMessageRequestDto';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  chatId: string = '';
  chatName: string = 'Chat';
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  isSending: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.chatId = params['id'];
      console.log('Chat ID:', this.chatId);
      this.loadMessages();
    });
  }


goHome(): void {
  this.router.navigate(['/home']); 
}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  loadMessages(): void {
    this.isLoading = true;
    this.chatService.getMessages(this.chatId).subscribe({
      next: (data) => {
        console.log('Mensajes cargados:', data);
        this.messages = data.map(msg => ({
          content: msg.content,
          isUser: msg.type === 'PERSON',
          timestamp: new Date(msg.timestamp)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.isLoading = false;
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.isSending) {
      return;
    }

    // Agregar mensaje del usuario visualmente
    const userMessage: Message = {
      content: this.newMessage,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);

    // Preparar el request
    const request: RegisterMessageRequestDto = {
      messageContent: this.newMessage
    };

    // Limpiar el input
    this.newMessage = '';
    this.isSending = true;

    // Enviar al backend
    this.chatService.askBot(this.chatId, request).subscribe({
      next: (response) => {
        console.log('Respuesta del bot:', response);
        
        // Agregar respuesta del bot
        const botMessage: Message = {
          content: response.response,
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(botMessage);
        this.isSending = false;
      },
      error: (error) => {
        console.error('Error al enviar mensaje:', error);
        
        // Mensaje de error
        const errorMessage: Message = {
          content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(errorMessage);
        this.isSending = false;
      }
    });
  }

  onEnterPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}