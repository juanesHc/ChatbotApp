import { Routes } from '@angular/router';
import { UserhomeComponent } from './components/home/userhome/userhome.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Bot' },
  { path: 'userhome', component: UserhomeComponent, title: 'Bot', canActivate: [authGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];