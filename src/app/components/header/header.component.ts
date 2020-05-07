import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PopoverController, ActionSheetController, ModalController } from "@ionic/angular";
import { PopNotificationsComponent } from 'src/app/components/pop-notifications/pop-notifications.component';
import { ShowListNotificationsPage } from 'src/app/modals/show-list-notifications/show-list-notifications.page';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() title: string;
    @Input() showNoti = true;
    @Input() showBackButton = true;
    @Input() showOptions = true;
    @Output() optionsSelected = new EventEmitter();

    notificationsIcon = 'notifications-outline';
    optionsHeaderIcon = 'more';

    constructor(
        public popoverCtrl: PopoverController,
        private actionCtrl: ActionSheetController,
        private modalCtrl: ModalController
    ) { }

    ngOnInit() { }

    testiconNoti() {
        this.notificationsIcon = (this.notificationsIcon === 'notifications-outline' ? 'notifications' : 'notifications-outline');
    }
    showNotifications(event){
        this.showNotiPopover(event)
    }

    async showOptionsHeader() {
        const filterOption = {
            text: 'Filtrar',
            icon: 'ios-funnel',
            handler: () => {
            }
        };
        const searchOption = {
            text: 'Buscar',
            icon: 'search',
            handler: () => {
            }
        };
        const reportOption = {
            text: 'Reportar',
            icon: 'send',
            handler: () => {
            }
        };

        const actionSheet = await this.actionCtrl.create({
            header: 'Opciones',
            buttons: [filterOption, searchOption, reportOption]
        });
        await actionSheet.present();
    }

    async showNotiPopover(evento) {
        const popover = await this.popoverCtrl.create({
            component: PopNotificationsComponent,
            event: evento,
            backdropDismiss: true,
            showBackdrop: false,
            cssClass: 'popover-app-notifications'
        });
        await popover.present();
    }

    async showListNotificationsModal() {
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
