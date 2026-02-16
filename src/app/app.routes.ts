import { Routes } from '@angular/router';
import { UserhomeComponent } from './components/home/userhome/userhome.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
    { path: '', component: UserhomeComponent, title: 'Bot' },
    { path: 'userhome', component: UserhomeComponent, title: 'Bot' },
    { path: 'chat/:id', component: ChatComponent },  

];


