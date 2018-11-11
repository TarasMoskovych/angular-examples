import { Component, HostBinding, HostListener } from '@angular/core';

@Component({
  selector: 'app-host', // <-- This is a host.
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
})
export class HostComponent {
  @HostBinding('class')
  attrClass = 'headingClass';

  @HostListener('click')
  clicked() {
    console.log('click event on host element');
  }

  @HostListener('mouseenter', ['$event'])
  enter(event: Event) {
    console.log(event );
  }

  @HostListener('mouseleave')
  leave(event: Event) {
    console.log('mouseleave event on host element');
  }
}
