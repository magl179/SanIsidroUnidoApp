import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NetworkService } from 'src/app/services/network.service';
import { UtilsService } from '../../services/utils.service';

// declare var moment: any;
// moment.locale('es');


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    isConnected = true;
    infodeviceID = null;
    constructor(
        private notiService: NotificationsService,
        private networkService: NetworkService,
        private utilsService: UtilsService
    ) {

    }

    ngOnInit() {
        this.notiService.getIDSubscriptor().subscribe(data => {
            if (data) {
                this.infodeviceID = data;
            }
        });
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.isConnected = connected;
        });
        // const testMoment = moment();
        // const datetest = new Date('2019-07-15 09:30:26');
        // const m = moment('2019-07-15', 'YYYY-MM-DD');
        // const m2 = moment('2019-07-15');

        // console.log('You are ' + m.fromNow() + ' old'); // You are 23 years ago old
        // console.log('You are ' + m2.fromNow() + ' old2'); // You are 23 years ago old
        // console.log('You are ' + moment(1316116057189).fromNow() + ' old'); // You are 23 years ago old

        // const a = moment(new Date());
        // const b = moment(new Date('2019-07-15 09:30:26'));
        // // Fecha Pasada, Fecha Actual
        // const c = a.diff(b, 'days');
        // console.log('Diferencia entre dias: ', c);
        // // console.log('Fecha Actual: ', a);
        // // console.log('Fecha Anterior: ', b.format('LL'));
        // // console.log('Fecha Anterior: ', b.format('D MMMM'));
        // if (c <= 8) {
        //     console.log('Fecha Anterior', b.fromNow());
        // } else if (a.year() === b.year()) {
        //     console.log('Fecha Anterior: ', b.format('D MMMM'));

        // } else {
        //     console.log('Fecha Anterior', b.format('LL'));
        // }

        console.log('ex 1', this.utilsService.getBeatifulDate('2019-07-25 09:30:26'));
        console.log('ex 2', this.utilsService.getBeatifulDate('2019-07-15 09:30:26'));
        console.log('ex 3', this.utilsService.getBeatifulDate('2018-07-15 09:30:26'));

    }


}
