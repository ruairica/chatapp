import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'src/app/HelperClasses/guid';
import { MessagingService } from 'src/app/services/messaging.service';
import { IMessage } from '../../data-models/signal-r.types';
import { SignalRService } from '../../services/signal-r.service';

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

  constructor(private signalRService: SignalRService,
              private router: Router,
              private route: ActivatedRoute,
              private messagingService: MessagingService,
              private el: ElementRef) {
   }

  ngOnInit(): void {
    this.groupName = this.route.snapshot.paramMap.get('chatName').toLocaleLowerCase();
    this.nickName = localStorage.getItem(this.groupName ?? '');
    if (this.nickName) {
      this.hasNickName = true;
    }

    this.messagingService.checkGroupExists(this.groupName).subscribe((result: boolean) => {
      if (result === false)  {
        this.router.navigate(['/chat']);
      }
      else {
        if (this.groupName && this.hasNickName) {
          this.joinSignalR(this.groupName);
          this.loadMessages();
        }
      }
    });
  }

  confirmName() {
    if (this.name) {
      this.nickName = this.name;
      localStorage.setItem(this.groupName, this.nickName);
      this.hasNickName = true;
    }

    if (this.groupName && this.hasNickName) {
      this.joinSignalR(this.groupName);
      this.loadMessages();
    }
  }

  sendMessage() {
    console.log('in the send function in chat');
    const request: IMessage = {
      nickName: this.nickName,
      body: this.message,
      chatName: this.groupName
    };

    console.log(JSON.stringify(request));
    if (request.body && request.nickName) {
      this.messagingService.send(request).subscribe(() => {
        this.message = '';
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
    });
}

  private joinSignalR(groupName: string) {
    this.signalRService.init(groupName);
    this.signalRService.messages.subscribe(message => {
      console.log(message);
      this.allMessages.push(message);
    });
  }

  scrollToBottomMessage() {
    this.el.nativeElement.querySelector('.bottomMessage').scrollIntoView();
  }
}
