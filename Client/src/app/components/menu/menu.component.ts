import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IChat, IMessage } from 'src/app/data-models/signal-r.types';
import { MessagingService } from 'src/app/services/messaging.service';
import { Platform } from '@angular/cdk/platform';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router, private messagingService: MessagingService, private platform: Platform) { }

  joiningChat = false;
  joinGroupName = '';
  buttonsDisabled = false;
  hasRecentChats = false;
  recentChats: IMessage[] = [];
  alreadyInstalled = false;

  ngOnInit(): void {
    window.addEventListener('appinstalled', (evt) => {
      this.alreadyInstalled = true;
    });
    this.fillRecentMessages();
  }

  createChat(): void {
    this.buttonsDisabled = true;
    this.messagingService.createGroup().subscribe((result: IChat) => {
      this.buttonsDisabled = false;
      this.router.navigate(['/chat/', result.chatName]);
    });
  }

  joinAGroup(): void {
    this.joiningChat = true;
  }

  joinChat(): void {
    this.buttonsDisabled = true;
    if (this.joinGroupName && this.joinGroupName.length === 4) {
      this.buttonsDisabled = false;
      this.router.navigate(['/chat/', this.joinGroupName.toLocaleLowerCase()]);
    } else {
      this.joinGroupName = '';
      this.buttonsDisabled = false;
    }
  }

  fillRecentMessages(): void {
    const recentChatNames: string[] = JSON.parse(localStorage.getItem('recentChats' ?? ''));
    if (recentChatNames  && recentChatNames.length > 0) {
      this.messagingService.fillRecentChats(recentChatNames).subscribe((result: IMessage[]) => {
        this.recentChats = result;
        this.hasRecentChats  = true;
      });
    }
  }

  displayDownloadOption(): void {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        event.prompt();
      });
  }

  deferredPrompt: any;

  @HostListener('window:beforeinstallprompt', ['$event'])
onbeforeinstallprompt(e) {
  console.log(e);
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  this.deferredPrompt = e;
}
addToHomeScreen() {
  // hide our user interface that shows our A2HS button
  // Show the prompt
  this.deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  this.deferredPrompt.userChoice
  .then((choiceResult) => {
  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
  } else {
    console.log('User dismissed the A2HS prompt');
  }
  this.deferredPrompt = null;
});
}
}
