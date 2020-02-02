import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, PopoverController, ActionSheetController } from "@ionic/angular";
import { PopNotificationsComponent } from '../pop-notifications/pop-notifications.component';
import { NavigationService } from 'src/app/services/navigation.service';
import { environment } from 'src/environments/environment';
import { CONFIG } from 'src/config/config';

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
        private navCtrl: NavController,
        private actionCtrl: ActionSheetController,
        private popoverCtrl: PopoverController,
        private navigationService: NavigationService
    ) { }

    ngOnInit() {
        this.backUrl = this.backUrl || `/${CONFIG.HOME_ROUTE}`;
        // if (this.search) {
        //     this.optionsCtrl.push(this.options.search);
        // }
        if (this.filter) {
            this.optionsCtrl.push(this.options.filter);
        }
        if (this.report) {
            this.optionsCtrl.push(this.options.report);
        }
        this.optionsCtrl.push(this.options.cancel);
    }

    testiconNoti() {
        this.notificationsIcon = (this.notificationsIcon === 'notifications-outline' ? 'notifications' : 'notifications-outline');
    }

    async showNotiPopover(evento: any) {
        const popover = await this.popoverCtrl.create({
            component: PopNotificationsComponent,
            event: evento,
            backdropDismiss: true,
            showBackdrop: false
        });
        await popover.present();
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
