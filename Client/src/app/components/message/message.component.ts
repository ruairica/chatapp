import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from '../../data-models/signal-r.types';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor() { }

  @Input() message: IMessage;

  ngOnInit(): void {
    if (!this.message) {
      this.message = { nickName: 'Ruairi', body: 'this is the body of the messageis the body of the messageis the body of the messageis the body of the message'};
    }
  }

}
