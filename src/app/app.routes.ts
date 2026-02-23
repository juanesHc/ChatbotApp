import { Routes } from '@angular/router';
import { UserhomeComponent } from './components/home/userhome/userhome.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RetrieveuserComponent } from './components/retrieveuser/retrieveuser.component';
import { RegisterComponent } from './components/register/register.component';



export const routes: Routes = [
  { path: 'home', component: UserhomeComponent, title: 'Bot', canActivate: [authGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [authGuard] },
  {path: 'retrieve-users', component: RetrieveuserComponent, canActivate: [authGuard]},
{path:'register',component:RegisterComponent,canActivate:[authGuard]},

  { path: 'login', component: LoginComponent, title: 'Bot' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];