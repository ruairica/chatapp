import { Component, OnInit } from '@angular/core';
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
  receivedMessage: string = '';
  allMessages: IMessage[] = [];
  userId: string;

  constructor(private signalRService: SignalRService) {
   }

  ngOnInit(): void {

    //this.joinSignalR();
  }

  private joinSignalR(groupName: string) {
    this.signalRService.init(groupName);
    this.signalRService.messages.subscribe(message => {
      console.log(message);
      this.receivedMessage = `${message.Name}: ${message.Body}`;
      //this._snackBar.open(`${message.Name}: ${message.Message}`);
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
    this.signalRService.send(request).subscribe(() => {
      this.message = '';
    });
  }

  joinGroup() {
    this.joinSignalR(this.groupName);

    // this.signalRService.join(this.groupName, this.userId).subscribe(() => { });
  }
}
