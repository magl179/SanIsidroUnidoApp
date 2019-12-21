import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ShowListNotificationsPage } from 'src/app/modals/show-list-notifications/show-list-notifications.page';


@Component({
    selector: 'app-pop-notifications',
    templateUrl: './pop-notifications.component.html',
    styleUrls: ['./pop-notifications.component.scss'],
})
export class PopNotificationsComponent implements OnInit {

    constructor(
        private modalCtrl: ModalController,
        private popoverCtrl: PopoverController
    ) { }

    ngOnInit() { }

    showAllNotifications() {
        // alert('Show all notifications');
        this.showListNotificationsModal();
    }

    async showListNotificationsModal() {
        await this.popoverCtrl.dismiss();
        const modal = await this.modalCtrl.create({
            component: ShowListNotificationsPage,
            componentProps: {
                nombre: 'Stalin',
                pais: 'Ecuador'
            }
        });
        await modal.present();
    }

}
