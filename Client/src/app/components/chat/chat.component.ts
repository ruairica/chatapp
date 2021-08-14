import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagingService } from 'src/app/services/messaging.service';
import { IMessage } from '../../data-models/signal-r.types';
import { SignalRService } from '../../services/signal-r.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfirmationService } from 'primeng/api';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {

  message: string;
  nickName: string;
  groupName: string;
  allMessages: IMessage[] = [];
  joinedChat = false;
  name: string;
  hasNickName = false;
  innerWidth = window.innerWidth;
  private subscription: Subscription;
  // https://stackoverflow.com/questions/40664766/how-to-detect-scroll-to-bottom-of-html-element

  constructor(private signalRService: SignalRService,
              private router: Router,
              private route: ActivatedRoute,
              private messagingService: MessagingService,
              private el: ElementRef,
              private clipboard: Clipboard,
              private confirmationService: ConfirmationService) {
   }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.groupName = this.route.snapshot.paramMap.get('chatName').toLocaleLowerCase();
    this.nickName = localStorage.getItem(this.groupName ?? '');
    if (this.nickName) {
      this.hasNickName = true;
    }

    this.messagingService.checkGroupExists(this.groupName).subscribe((result: boolean) => {
      if (result === false)  {
        this.router.navigate(['/chat']);
      }
      else if (this.groupName && this.hasNickName) {
        this.startReceivingMessages();
        }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.innerWidth = window.innerWidth;
  }

  copyShareLink(event: Event): void {
    this.clipboard.copy(`Join my chat! ${window.location.origin}${this.router.url}`);
    this.confirmationService.confirm({
      target: event.target,
      message: 'Copied link!',
      icon: 'pi pi-check-circle',
      acceptVisible: false,
      rejectVisible: false
    });

    let t = timer(500);
    this.subscription = t.subscribe(t => {
      this.confirmationService.close();
    });
  }

  confirmName(): void {
    if (this.name) {
      this.nickName = this.name;
      localStorage.setItem(this.groupName, this.nickName);
      this.hasNickName = true;
    }

    if (this.groupName && this.hasNickName) {
      this.startReceivingMessages();
    }
  }

  startReceivingMessages(): void {
    this.joinSignalR(this.groupName);
    this.loadMessages();
    this.addToRecentChats();
  }

  sendMessage() {
    const request: IMessage = {
      nickName: this.nickName,
      body: this.message,
      chatName: this.groupName
    };

    if (request.body && request.nickName) {
      this.messagingService.send(request).subscribe(() => {
        this.message = '';
        this.scrollToBottomMessage();
      });
    }
  }

  loadMessages(): void {
    let earliestTimetamp: number;
    if (this.allMessages.length > 0) {
      earliestTimetamp = this.allMessages[0].timeStamp;
    }
    this.messagingService.getPastMessages(this.groupName, earliestTimetamp).subscribe((result: IMessage[]) => {
      this.allMessages.unshift(...result);
      //this.scrollToBottomMessage();
    });
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any){
    if( event.target.scrollTop === 0) {
      this.loadMessages();
    }
  }

  private joinSignalR(groupName: string) {
    this.signalRService.init(groupName);
    this.signalRService.messages.subscribe(message => {
      console.log(message);
      this.allMessages.push(message);
    });
  }

  scrollToBottomMessage(): void {
    this.el.nativeElement.querySelector('.bottomMessage').scrollIntoView();
  }

  addToRecentChats() {
    const storageItem = localStorage.getItem('recentChats');
    console.log(storageItem);
    const recentChats: string[] = storageItem === null ? [] : JSON.parse(storageItem);
    console.log(recentChats);
    const indexOfCurrentchat = recentChats.findIndex(x => x === this.groupName);
    console.log(indexOfCurrentchat);

    // current chat should become the most recent chat
    // storing the names of the 3 most recent chats
    if (indexOfCurrentchat === -1) {
      if (recentChats.length >= 3) {
        recentChats.pop();
      }
      recentChats.unshift(this.groupName);
    }
    else {
      recentChats.unshift(recentChats[indexOfCurrentchat]);
      recentChats.splice(indexOfCurrentchat + 1, 1);
    }

    localStorage.setItem('recentChats', JSON.stringify(recentChats));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
