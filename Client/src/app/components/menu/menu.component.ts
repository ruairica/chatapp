import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IChat, IMessage } from 'src/app/data-models/signal-r.types';
import { MessagingService } from 'src/app/services/messaging.service';
import { Platform } from '@angular/cdk/platform';
import { timer } from 'rxjs';
import { Subscription } from 'rxjs';
 

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
  alreadyInstalled = true;
  deferredPrompt: any;
  isMobile = false;
  downloadLabel = "Download the app"
  private subscription: Subscription;
  emoji: any;

  ngOnInit(): void {
    this.emoji = String.fromCodePoint(0x1F354);
    this.fillRecentMessages();
    let t = timer(1500);
    this.subscription = t.subscribe(t => {
      this.downloadLabel = '';
    });

    this.isMobile = (this.platform.IOS || this.platform.ANDROID);

    // TODO: IOS functionality
    if (this.platform.IOS) {
      this.alreadyInstalled = false;
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e) {
  // if this event is hit, the app is not installed so show button
  this.alreadyInstalled = false;
  this.deferredPrompt = e;
  console.log('before instlaled');
  }

  createChat(): void {
    this.buttonsDisabled = true;
    this.messagingService.createGroup().subscribe((result: IChat) => {
      this.buttonsDisabled = false;
      this.router.navigate(['/chat/', result.chatName]);
    });
  }

  undoJoiningChat(): void {
    this.joiningChat = false;
    this.joinGroupName = '';
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
    let recentChatNames: string[] = JSON.parse(localStorage.getItem('recentChats' ?? ''));
    if (recentChatNames  && recentChatNames.length > 0) {
      this.messagingService.fillRecentChats(recentChatNames).subscribe((result: IMessage[]) => {
        this.recentChats = result;
        this.hasRecentChats  = true;

        //removing any chats that are now invalid (>24hours since the last message)
        recentChatNames = result.map(x => x.chatName);
        localStorage.setItem('recentChats', JSON.stringify(recentChatNames));
      });
    }
  }

  displayDownloadOption(): void {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        event.prompt();
      });
  }

  addToHomeScreen() {
    if (!this.platform.IOS) {
      this.deferredPrompt.prompt();

      this.deferredPrompt.userChoice
        .then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.alreadyInstalled = true;
          }
          this.deferredPrompt = null;
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
