import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { PopNotificationsComponent } from '../pop-notifications/pop-notifications.component';

@Component({
    selector: 'app-header-back',
    templateUrl: './header-back.component.html',
    styleUrls: ['./header-back.component.scss'],
})
export class HeaderBackComponent implements OnInit {

    @Input() title: string;
    @Input() hrefDefault = 'home';
    @Input() showNoti = true;
    @Input() searchAvalaible = false;
    @Input() filterAvalaible = false;
    @Input() reportAvalaible = false;
    @Output() returnHeaderBackData = new EventEmitter();
    notificationsIcon = 'notifications-outline';
    
    constructor(
        private navCtrl: NavController,
        private popoverCtrl: PopoverController
    ) { }

    ngOnInit() { }

    goToRoot() {
        this.navCtrl.navigateBack(this.hrefDefault);
    }

    testiconNoti() {
        this.notificationsIcon = (this.notificationsIcon === 'notifications-outline' ? 'notifications' : 'notifications-outline');
    }

    throwSearch(event: any) {
        this.returnHeaderBackData.emit({wannaSearch: true});
    }
    throwFilter(event: any) {
        this.returnHeaderBackData.emit({wannaFilter: true});
    }
    throwReport(event: any) {
        this.returnHeaderBackData.emit({wannaReport: true});
    }

    async showNotiPopover(evento) {
        const popover = await this.popoverCtrl.create({
            component: PopNotificationsComponent,
            event: evento,
            backdropDismiss: true,
            showBackdrop: false
        });
        await popover.present();
    }

}
