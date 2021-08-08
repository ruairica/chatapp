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

  ngOnInit(): void {
  }

  createChat(): void {
    this.messagingService.createGroup().subscribe((result: IChat) => {
      this.router.navigate(['/chat/', result.chatName]);
    });
  }

  joinAGroup(): void {
    this.joiningChat = true;
  }

  joinChat(): void {
    if (!this.joinGroupName.match(/^[a-z0-9]+$/i)) {
      this.joinGroupName = '';
    } else {
      this.router.navigate(['/chat/', this.joinGroupName.toLocaleLowerCase()]);
    }
  }
}
