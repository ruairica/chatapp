import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HelloWorldService } from '../../services/hello-world.service';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss']
})
export class HelloWorldComponent implements OnInit {

  private subscriptions: { [key: string]: Subscription; } = {};

  constructor(private service: HelloWorldService) { }

  message = 'if you are seeing this the api call did not work';

  ngOnInit(): void {
    this.subscriptions.test = this.service.testApiEndpoint().subscribe((result: boolean) =>
    {
      if(result === true) {
        this.message = 'api call successful!';
      }
    });
  }


  ngOnDestroy(): void {
    for (const field of Object.keys(this.subscriptions)) {
      this.subscriptions[field].unsubscribe();
    }
  }
}
