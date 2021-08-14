import {
  Directive, HostListener, Output, EventEmitter
}
from '@angular/core';

@Directive({
  selector: '[scrollTracker]',
})

//from https://stackblitz.com/edit/angular-5-scrolltracker?file=app%2FScrollTracker.directive.ts
export class ScrollTrackerDirective {
  @Output() scrolled = new EventEmitter<any>();

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    // do tracking
    // console.log('scrolled', event.target.scrollTop);
    // Listen to click events in the component
    console.log('on scorll event')
    let tracker = event.target;
    let endReached = false;
    let limit = tracker.scrollHeight - tracker.clientHeight;
    
    console.log(event.target.scrollTop, limit);
    if (event.target.scrollTop === limit) {
      //alert('end reached');
      endReached = true;
    }

    this.scrolled.emit({
      pos: event.target.scrollTop,
      endReached
    })
  }
}