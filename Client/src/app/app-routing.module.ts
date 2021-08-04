import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'chat',
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
