import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    loading: any;
    elements: any = [];

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService
    ) { }

    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Publicaciones');
        this.loading.present();
        setTimeout(() => {
            this.elements = [1, 1, 1, 1];
            this.loading.dismiss();
        }, 1500);
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }
    postDetail(id) {
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }


}
