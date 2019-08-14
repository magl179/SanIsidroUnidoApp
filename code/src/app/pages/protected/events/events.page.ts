import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { IEvent } from 'src/app/interfaces/barrios';
import { PostsService } from '../../../services/posts.service';
@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

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

    ngOnInit() {
        this.loadEvents();
    }

    ngOnDestroy(){
        this.postService.resetEventsPage();
    }

    loadEvents(event?) {
        this.postService.getEvents().subscribe(res => {
            if (res.data) {
                console.log('data', res);
                if (res.data.data.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.eventsList.push(...res.data.data);
                if (event) {
                    event.target.complete();
                }
            }
        },
        err => {
            console.log(err);
        });
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }
    postDetail(id) {
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }

    getInfiniteScrollData(event) {
            this.loadEvents(event);
    }


}
