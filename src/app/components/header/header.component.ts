import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PopoverController, ActionSheetController } from "@ionic/angular";
import { PopNotificationsComponent } from '../pop-notifications/pop-notifications.component';


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
        private actionCtrl: ActionSheetController
    ) { }

    ngOnInit() { }

    testiconNoti() {
        this.notificationsIcon = (this.notificationsIcon === 'notifications-outline' ? 'notifications' : 'notifications-outline');
    }

    // showOptionsHeader() {

    // }

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


    // lanzar(event) {
    //     this.optionsSelected.emit({ nombre: this.nombre });
    // }


    async showNotiPopover(evento) {
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
