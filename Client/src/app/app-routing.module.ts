import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'helloworld',
        component: HelloWorldComponent,
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
