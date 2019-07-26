import { Component, OnInit, Input } from '@angular/core';
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

    async MostrarPopover(evento) {
        const popover = await this.popoverCtrl.create({
            component: PopNotificationsComponent,
            event: evento,
            backdropDismiss: true,
            showBackdrop: false
        });

        await popover.present();

        // // const { data } = await popover.onDidDismiss();
        // const { data } = await popover.onWillDismiss();
        // console.log('Dato recibido del hijo al padre Popover', data);
    }

}
