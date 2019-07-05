import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
// import { trigger, style, state, query, stagger, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    elements = [];
    loading: any;

    constructor(
        private utilsService: UtilsService
    ) { }

    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Datos');
        this.loading.present();
        setTimeout(() => {
            this.elements = [1, 1, 1];
            this.loading.dismiss();
        }, 3000);
    }

}
