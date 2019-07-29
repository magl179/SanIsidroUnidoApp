import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { IEvent } from 'src/app/interfaces/barrios';
import { PostsService } from '../../../services/posts.service';
@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    loading: any;
    elements: any = [];

    eventsList: IEvent = null;

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService
    ) { }


    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        console.log('GET FULL DATE', fulldate);
        return fulldate;
    }

    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Publicaciones');
        this.loading.present();
        // setTimeout(() => {
        //     this.elements = [1, 1, 1, 1];
        //     this.loading.dismiss();
        // }, 1500);
        this.postService.getEvents().subscribe(data => {
            if (data) {
                this.eventsList = data;
                this.loading.dismiss();
            }
        });
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }
    postDetail(id) {
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }


}
