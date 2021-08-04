import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Guid } from 'src/app/HelperClasses/guid';
import { IMessage } from '../../data-models/signal-r.types';
import { SignalRService } from '../../services/signal-r.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  message: string;
  name: string;
  groupName: string;
  allMessages: IMessage[] = [];
  userId: string;
  joinedChat = false;

  constructor(private signalRService: SignalRService) {
   }

  ngOnInit(): void {

    //this.joinSignalR();
  }

  private joinSignalR(groupName: string) {
    this.signalRService.init(groupName);
    this.signalRService.messages.subscribe(message => {
      console.log(message);
      this.allMessages.push(message);
    });
  }

  sendMessage() {
    console.log('in the send function in chat')
    const request: IMessage = {
      Name: this.name,
      Body: this.message,
      GroupName: this.groupName
    }

    if (request.Body && request.Name) {
      this.signalRService.send(request).subscribe(() => {
        this.message = '';
      });
    }
  }

  joinGroup() {
    if (this.groupName){
      this.joinSignalR(this.groupName);
      this.joinedChat = true;
    }
    // this.signalRService.join(this.groupName, this.userId).subscribe(() => { });
  }
}
