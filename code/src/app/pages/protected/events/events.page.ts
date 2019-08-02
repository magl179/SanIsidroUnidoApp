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

    eventsList: IEvent[] = [];

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService
    ) { }


    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }

    async ngOnInit() {
        this.postService.getEvents().subscribe(data => {
            if (data) {
                setTimeout(() => {
                    this.eventsList = data;
                    console.log('events lenght: ', data.length);
                }, 3500);
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
