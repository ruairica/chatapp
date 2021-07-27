import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signal-r.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message: string;
  receivedMessage: string = '';

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {

    this.signalRService.init();
    this.signalRService.messages.subscribe(message => {
      console.log(message)
      this.receivedMessage = `${message.Name}: ${message.Body}`
      //this._snackBar.open(`${message.Name}: ${message.Message}`);
    });
  }

  send() {
    console.log('in the send function in chat')
    this.signalRService.send(this.message).subscribe(() => {
      this.message = '';
    });
  }

}
