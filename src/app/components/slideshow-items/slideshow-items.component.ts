import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'slideshow-items',
  templateUrl: './slideshow-items.component.html',
  styleUrls: ['./slideshow-items.component.scss'],
})
export class SlideshowItemsComponent implements OnInit {


    slideOpts = {
        // slidesPerView: 1.3,
        // freeMode: true
        // loop: true
    }

    items = [
        { title: '', color: 'primary' },
        { title: '', color: 'secondary' },
        { title: '', color: 'tertiary' },
        { title: '', color: 'warning' },
        { title: '', color: 'dark' },
        { title: '', color: 'success' },
        { title: '', color: 'light' },
        { title: '', color: 'medium' },
        { title: '', color: 'orange' }
    ];

  constructor() { }

    ngOnInit() { }
    
    slideChange(event: any) {
        event.target.isBeginning().then(is_first_slide => {
            if (is_first_slide) {
                event.target.lockSwipeToPrev(true);
            } else {
                event.target.lockSwipeToPrev(false);
            }
        });
        event.target.isEnd().then(is_last_slide => {
            if (is_last_slide) {
                event.target.lockSwipeToNext(true);
            } else {
                event.target.lockSwipeToNext(false);
            }
        });
    }

    // Funcion cuando el slide carga
    slidesLoaded(event: any) {
        event.target.lockSwipeToPrev(true);
    }

}
