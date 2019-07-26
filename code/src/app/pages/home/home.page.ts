import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { DataAppService } from '../../services/data-app.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    servicesList = [];
    servicesList2 = [
        {
            title: 'Reportar Emergencia',
            // tslint:disable-next-line: max-line-length
            icon: 'https://banner2.kisspng.com/20180325/svq/kisspng-computer-icons-webcam-download-web-camera-5ab74e027af8e9.5389996915219624985037.jpg',
            url: '/social-problems'
        },
        {
            title: 'Reportar Problema',
            // tslint:disable-next-line: max-line-length
            icon: 'https://banner2.kisspng.com/20180325/svq/kisspng-computer-icons-webcam-download-web-camera-5ab74e027af8e9.5389996915219624985037.jpg',
            url: '/social-problems'
        },
        {
            title: 'Servicios Públicos',
            // tslint:disable-next-line: max-line-length
            icon: 'https://banner2.kisspng.com/20180325/svq/kisspng-computer-icons-webcam-download-web-camera-5ab74e027af8e9.5389996915219624985037.jpg',
            url: '/social-problems'
        },
        {
            title: 'Directorio Barrial',
            // tslint:disable-next-line: max-line-length
            icon: 'https://banner2.kisspng.com/20180325/svq/kisspng-computer-icons-webcam-download-web-camera-5ab74e027af8e9.5389996915219624985037.jpg',
            url: '/social-problems'
        },
        {
            title: 'Problemas Sociales',
            // tslint:disable-next-line: max-line-length
            icon: 'https://banner2.kisspng.com/20180325/svq/kisspng-computer-icons-webcam-download-web-camera-5ab74e027af8e9.5389996915219624985037.jpg',
            url: '/social-problems'
        },
        {
            title: 'Eventos',
            // tslint:disable-next-line: max-line-length
            icon: 'https://banner2.kisspng.com/20180325/svq/kisspng-computer-icons-webcam-download-web-camera-5ab74e027af8e9.5389996915219624985037.jpg',
            url: '/social-problems'
        },
    ];

    constructor(
        private utilsService: UtilsService,
        private dataService: DataAppService
    ) { }

    async ngOnInit() {
        await this.dataService.getHomeOptions().subscribe((data) => {
            this.servicesList = data;
        });
        await this.utilsService.enableMenu();
    }

    onClearBDD() {
        this.utilsService.clearBDD();
    }

}
