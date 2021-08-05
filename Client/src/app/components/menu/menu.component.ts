import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) { }

  joiningChat = false;
  joinGroupName = '';

  ngOnInit(): void {
  }

  createChat(): void {
    const chatName = this.generateChatName();
    this.router.navigate(['/chat/', chatName]);
  }
  
  joinAGroup(): void {
    this.joiningChat = true;
  }

  joinChat(): void {
    if(!this.joinGroupName.match(/^[a-z0-9]+$/i)) {
      this.joinGroupName = ''
    } else {
      this.router.navigate(['/chat/', this.joinGroupName]);
    }
    

  }

  generateChatName(): string {
    //returns 3 character alphanumeric
    return (Math.random().toString(36)+'00000000000000000').slice(2, 5)
  }
}
