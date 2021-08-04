import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './components/chat/chat.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//primeNG modules
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { MessageComponent } from './message/message.component';
@NgModule({
  declarations: [AppComponent, ChatComponent, MessageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
