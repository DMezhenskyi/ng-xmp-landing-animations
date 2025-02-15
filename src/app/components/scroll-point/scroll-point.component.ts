import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";

import { ScrollService } from "../../services/scroll.service";

@Component({
  selector: 'app-slide',
  templateUrl: './scroll-point.component.html',
  styleUrls: ['./scroll-point.component.scss'],
  animations: [
    trigger('scrolling', [
      state('*', style({
        opacity: 0,
        transform: 'translateX(-200%)'
      })),
      state('visible', style({
        opacity: '*' // opacity is 1.0 by default
      })),
      state('hidden', style({
        opacity: 0.1
      })),
      transition('visible => hidden', animate('500ms ease-out')),
      transition('hidden => visible', animate('200ms ease-in'))
    ])
  ]
})
export class ScrollPointComponent implements OnInit {

  public typescript = `
    import { fromEvent, Observable } from "rxjs";
    import { debounceTime, map } from "rxjs/operators";

    scrollEvent$ = fromEvent(window, 'wheel');

    getEvent(): Observable<WheelEvent | Event> {
      return this.scrollEvent$.pipe(
        map((event) => event),
        debounceTime(50)
      );
    }
  `;

  @ViewChild('image') image!: ElementRef;
  inViewport = false;
  cards = [
    "@angular/animations is installed by default",
    "import { BrowserAnimationsModule } from '@angular/platform-browser/animations';",
    "Animation provides the illusion of motion: HTML elements change styling over time",
    "Well-designed animations can make your application more fun and straightforward to use",
    "Motion greatly enhances the user experience",
    "Angular's animation system is built on CSS functionality"
  ];

  constructor(@Inject(ScrollService) private scroll: ScrollService) {
    console.log(JSON.stringify(this.typescript))
  }

  get slideState() {
    return this.inViewport ? 'visible' : 'hidden';
  }

  ngOnInit() {
    this.scroll.getEvent().subscribe((event) => {
      this.inViewport = this.isInViewport(this.image.nativeElement);
    });
  }

  isInViewport(el: HTMLElement) {
    const rect = el.getBoundingClientRect();

    return (
      rect.top <= 600 &&
      rect.bottom >= 300
    );
  }

  toggleSlide() {
    this.inViewport = !this.inViewport;
  }

}
