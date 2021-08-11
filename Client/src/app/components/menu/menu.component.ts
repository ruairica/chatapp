import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IChat, IMessage } from 'src/app/data-models/signal-r.types';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router, private messagingService: MessagingService) { }

  joiningChat = false;
  joinGroupName = '';
  buttonsDisabled = false;
  hasRecentChats = false;
  recentChats: IMessage[] = [];
 
  ngOnInit(): void {
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
}
