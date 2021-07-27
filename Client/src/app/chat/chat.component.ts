import { Component, OnInit } from '@angular/core';
import { IMessage } from '../data-models/signal-r.types';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  message: string;
  name: string;
  receivedMessage: string = '';
  allMessages: IMessage[] = [];

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {

    this.signalRService.init();
    this.signalRService.messages.subscribe(message => {
      console.log(message)
      this.receivedMessage = `${message.Name}: ${message.Body}`
      //this._snackBar.open(`${message.Name}: ${message.Message}`);
      this.allMessages.push(message);
    });
  }

  send() {
    console.log('in the send function in chat')
    const request: IMessage = {
      Name: this.name,
      Body: this.message,
      GroupName: "testGroup"
    }
    this.signalRService.send(request).subscribe(() => {
      this.message = '';
    });
  }

}
