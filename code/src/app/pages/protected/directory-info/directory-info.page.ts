import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
// import { trigger, style, state, query, stagger, animate, transition } from '@angular/animations';
import Preloader from 'src/app/helpers/preloader-image';

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    boardMembers = [];
    loading: any;
    imgLoaded = false;

    constructor(
        private utilsService: UtilsService,
        private directivesService: DirectivesService
    ) { }

    async ngOnInit() {
        this.directivesService.getDirectivesData().subscribe(data => {
            if (data) {
                const imagesPath = data.map(el => el.avatar);
                Preloader.preloadImages({
                    images: imagesPath,
                    completed: () => {
                        setTimeout(() => {
                            this.boardMembers = data;
                        }, 2500);
                    }
                });
            }
        });
    }

    imageWasLoaded() {
        this.imgLoaded = true;
    }

}
