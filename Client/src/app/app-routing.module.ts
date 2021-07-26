import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'helloworld',
        component: HelloWorldComponent,
      },
      {
        path: 'chat',
        component: ChatComponent,
      },
      {
        path: '**',
        redirectTo: '/helloworld'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
