import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatComponent } from './components/chat/chat.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// primeNG modules
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { MessageComponent } from './components/message/message.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MenuComponent } from './components/menu/menu.component';
import {DividerModule} from 'primeng/divider';
import {TooltipModule} from 'primeng/tooltip';
import {ConfirmPopupModule} from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [AppComponent, ChatComponent, MessageComponent, MenuComponent],
  exports: [InfiniteScrollModule],
  imports: [
    BrowserModule,
    ConfirmPopupModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    DividerModule,
    ButtonModule,
    FormsModule,
    InfiniteScrollModule,
    TooltipModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
