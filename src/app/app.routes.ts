import { Routes } from '@angular/router';
import { UserhomeComponent } from './components/home/userhome/userhome.component';
import { ChatComponent } from './components/chat/chat.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RetrieveuserComponent } from './components/retrieveuser/retrieveuser.component';
import { RegisterComponent } from './components/register/register.component';
import { MyaccountComponent } from './components/myaccount/myaccount.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SentnotificationComponent } from './components/sentnotification/sentnotification.component';



export const routes: Routes = [
  { path: 'home', component: UserhomeComponent, title: 'Bot', canActivate: [authGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [authGuard] },
  {path: 'retrieve-users', component: RetrieveuserComponent, canActivate: [authGuard]},
  {path:'register',component:RegisterComponent,canActivate:[authGuard]},
  {path:'my-account',component:MyaccountComponent,canActivate:[authGuard]},
  { path: 'edit-account', component: EditAccountComponent ,canActivate:[authGuard]},
  { path: 'notification', component: NotificationComponent ,canActivate:[authGuard]},
  { path: 'send-notification/:personId', component: SentnotificationComponent, canActivate:[authGuard] },

  { path: 'login', component: LoginComponent, title: 'Bot' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];