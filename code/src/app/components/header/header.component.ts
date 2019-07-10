import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopNotificationsComponent } from '../pop-notifications/pop-notifications.component';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() title: string;
    notificationsIcon = 'notifications-outline';

    constructor(
        public popoverCtrl: PopoverController
    ) { }

    ngOnInit() { }

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

        // const { data } = await popover.onDidDismiss();
        const { data } = await popover.onWillDismiss();
        console.log('Dato recibido del hijo al padre Popover', data);
    }

}
