import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IChat } from 'src/app/data-models/signal-r.types';
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

  ngOnInit(): void {
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
    if (!this.joinGroupName.match(/^[a-z0-9]+$/i)) {
      this.joinGroupName = '';
      this.buttonsDisabled = false;
    } else {
      this.buttonsDisabled = false;
      this.router.navigate(['/chat/', this.joinGroupName.toLocaleLowerCase()]);
    }
  }
}
