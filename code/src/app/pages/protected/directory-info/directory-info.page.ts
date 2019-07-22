import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
// import { trigger, style, state, query, stagger, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    boardMembers = [];
    loading: any;

    constructor(
        private utilsService: UtilsService,
        private directivesService: DirectivesService
    ) { }

    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Datos');
        this.loading.present();
        this.directivesService.getDirectivesData().subscribe(data => {
            if (data) {
                this.boardMembers = data;
                this.loading.dismiss();
            }
        });
    }

}
