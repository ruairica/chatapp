import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'chat',
        component: MenuComponent,
      },
      {
        path: 'chat/:chatName',
        component: ChatComponent,
      },
      {
        path: '**',
        redirectTo: '/chat'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
