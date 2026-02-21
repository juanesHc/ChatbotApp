import { Component, OnInit } from '@angular/core';
import { UserhomeService } from '../../../services/home/user/userhome.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RetrieveChatsNameResponseDto } from '../../../model/chat/retrieve/RetrieveChatsNameResponseDto';
import { RegisterChatNameRequestDto } from '../../../model/chat/register/RegisterChatNameRequestDto';
import { FormsModule } from '@angular/forms';
import { RetrieveGlobalMemoryResponseDto } from '../../../model/memory/RetrieveGlobalMemoryResponseDto';
import { MemoryService } from '../../../services/memory/memory.service';
import { LoginService } from '../../../services/login/login.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './userhome.component.html',
  styleUrl: './userhome.component.css'
})
export class UserhomeComponent implements OnInit {

  deletingMemoryId: string | null = null;

  chats: RetrieveChatsNameResponseDto[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  showCreateModal: boolean = false;
  newChatName: string = '';

  showEditModal: boolean = false;
  editingChat: RetrieveChatsNameResponseDto | null = null;
  editChatName: string = '';

  showDeleteModal: boolean = false;
  chatToDelete: RetrieveChatsNameResponseDto | null = null;

  showSuccessModal: boolean = false;
  successMessage: string = '';

  showMemoriesModal: boolean = false;
  memories: RetrieveGlobalMemoryResponseDto[] = [];
  loadingMemories: boolean = false;

  userName: string = "";

  constructor(
    private userhomeService: UserhomeService,
    private router: Router,
    private memoryService:MemoryService,
    private loginService:LoginService
  ) {}

  ngOnInit(): void {
 this.userName = this.loginService.getUserName();

    this.loadChats();
  }

  // ========== CARGAR CHATS ==========
  loadChats(): void {
    this.userhomeService.getChatsNameList().subscribe({
      next: (data) => {
        this.chats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar los chats:', error);
        this.errorMessage = 'No se pudieron cargar los chats';
        this.isLoading = false;
      }
    });
  }

  // ========== CREAR CHAT ==========
  createChat(): void {
    this.showCreateModal = true;
    this.newChatName = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newChatName = '';
  }

  confirmCreateChat(): void {
    if (!this.newChatName.trim()) {
      alert('Por favor ingresa un nombre para el chat');
      return;
    }

    const request: RegisterChatNameRequestDto = { name: this.newChatName };

    this.userhomeService.registerChatName(request).subscribe({
      next: (response) => {
        console.log('Chat creado:', response);
        this.closeCreateModal();
        this.showSuccessMessage(response.successfulMessage);
        this.loadChats();
      },
      error: (error) => {
        console.error('Error al crear el chat:', error);
        alert('Error al crear el chat');
      }
    });
  }

  // ========== EDITAR CHAT ==========
editChat(chat: RetrieveChatsNameResponseDto, event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  this.editingChat = chat;
  this.editChatName = chat.name;
  this.showEditModal = true;
}

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingChat = null;
    this.editChatName = '';
  }

  confirmEditChat(): void {
    if (!this.editChatName.trim()) {
      alert('Por favor ingresa un nombre para el chat');
      return;
    }
  
    if (!this.editingChat?.id) {
      alert('Error: no se puede editar el chat');
      return;
    }
  
    const request: RegisterChatNameRequestDto = { name: this.editChatName };
  
    this.userhomeService.updateChatName(request, this.editingChat.id).subscribe({
      next: (response) => {
        console.log('Chat actualizado:', response);
        this.closeEditModal();
        this.showSuccessMessage(response.successfulMessage);
        this.loadChats();
      },
      error: (error) => {
        console.error('Error al actualizar el chat:', error);
        alert('Error al actualizar el chat');
      }
    });
  }

  // ========== BORRAR CHAT ==========
  deleteChat(chat: RetrieveChatsNameResponseDto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (!chat.id) {
      alert('Error: no se puede borrar el chat');
      return;
    }
    
    this.chatToDelete = chat;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.chatToDelete = null;
  }

  confirmDeleteChat(): void {
    if (!this.chatToDelete?.id) {
      return;
    }

    this.userhomeService.deleteChat(this.chatToDelete.id).subscribe({
      next: (response) => {
        console.log('Chat borrado:', response);
        this.closeDeleteModal();
        this.showSuccessMessage(response.successfulMessage);
        this.loadChats();
      },
      error: (error) => {
        console.error('Error al borrar el chat:', error);
        this.closeDeleteModal();
        alert('Error al borrar el chat');
      }
    });
  }

  // ========== MODAL DE ÉXITO ==========
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successMessage = '';
  }

  openChat(chat: RetrieveChatsNameResponseDto): void {
    if (chat.id) {
      this.router.navigate(['/chat', chat.id]);
    }
  }

  openMemoriesModal(): void {
    this.showMemoriesModal = true;
    this.loadMemories();
  }

  closeMemoriesModal(): void {
    this.showMemoriesModal = false;
    this.memories = [];
  }

  loadMemories(): void {
    this.loadingMemories = true;
    this.memoryService.getMemories().subscribe({
      next: (data) => {
        console.log('Memorias cargadas:', data);
        this.memories = data;
        this.loadingMemories = false;
      },
      error: (error) => {
        console.error('Error al cargar memorias:', error);
        this.loadingMemories = false;
      }
    });
  }

  formatKey(key: string): string {
    // Convierte "user_name" a "Nombre de usuario"
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  deleteMemory(memoryId: string): void {
    this.deletingMemoryId = memoryId;
    this.memoryService.deleteMemory(memoryId).subscribe({
      next: () => {
        this.memories = this.memories.filter(m => m.id !== memoryId);
        this.deletingMemoryId = null;
      },
      error: () => {
        this.deletingMemoryId = null;
      }
    });
  }

}