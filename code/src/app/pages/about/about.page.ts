import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  infodeviceID = null;
    constructor(
      private notiService: NotificationsService
  ) { }

    ngOnInit() {
        this.notiService.getIDSubscriptor().subscribe(data => {
            if (data) {
                this.infodeviceID = data;
            }
        });
  }

}
