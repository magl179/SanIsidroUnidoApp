import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, ActionSheetController, ModalController } from "@ionic/angular";
import { PopNotificationsComponent } from 'src/app/components/pop-notifications/pop-notifications.component';
import { CONFIG } from 'src/config/config';
import { ShowListNotificationsPage } from 'src/app/modals/show-list-notifications/show-list-notifications.page';

@Component({
    selector: 'app-header-back',
    templateUrl: './header-back.component.html',
    styleUrls: ['./header-back.component.scss'],
})
export class HeaderBackComponent implements OnInit {

    @Input() title: string;
    @Input() backUrl: string;
    @Input() showNoti = true;
    @Input() showBackButton = true;
    @Input() search = false;
    @Input() urlSearchRedirect = '';
    @Input() filter = false;
    @Input() report = false;
    @Output() optionSelected = new EventEmitter();
    @Output() onSearch = new EventEmitter();

    notificationsIcon = 'notifications-outline';
    optionsHeaderIcon = 'more';

    optionsCtrl = [];
    private options = {
        filter: {
            text: 'Filtrar',
            cssClass: ['headerActionCtrl', 'btn-filter'],
            icon: 'ios-funnel',
            handler: () => {
                this.optionSelected.emit({
                    option: 'filter'
                })
            }
        },
        search: {
            text: 'Buscar',
            cssClass: ['headerActionCtrl', 'btn-search'],
            icon: 'search',
            handler: () => {
                this.optionSelected.emit({
                    option: 'search'
                });
            }
        },
        report: {
            text: 'Reportar',
            cssClass: ['headerActionCtrl', 'btn-report'],
            icon: 'send',
            handler: () => {
                this.optionSelected.emit({
                    option: 'report'
                })
            }
        },
        cancel: {
            text: 'Cancelar',
            icon: 'close',
            role: 'cancel',
            handler: () => {
            }
        }
    }

    constructor(
        private actionCtrl: ActionSheetController,
        private modalCtrl: ModalController,
        private popoverCtrl: PopoverController,
    ) { }

    ngOnInit() {
        this.backUrl = this.backUrl || `/${CONFIG.HOME_ROUTE}`;
        if (this.filter) {
            this.optionsCtrl.push(this.options.filter);
        }
        if (this.report) {
            this.optionsCtrl.push(this.options.report);
        }
        this.optionsCtrl.push(this.options.cancel);
    }

    async showNotifications(event): Promise<void>{
        return await this.showListNotificationsModal();
        // this.showNotiPopover(event);
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

    async showListNotificationsModal() {
        const modal = await this.modalCtrl.create({
            component: ShowListNotificationsPage
        });
        await modal.present();
    }

    async showOptionsHeader() {
        const actionSheet = await this.actionCtrl.create({
            header: 'Opciones',
            buttons: this.optionsCtrl
        });
        await actionSheet.present();
    }

    emitSearchEvent(){
        this.onSearch.emit({
            option: 'search'
        })
    }

}
