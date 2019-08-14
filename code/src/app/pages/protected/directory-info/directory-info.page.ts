import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
// import { trigger, style, state, query, stagger, animate, transition } from '@angular/animations';
import Preloader from 'src/app/helpers/preloader-image';
import { PostsService } from '../../../services/posts.service';
import { IDirective } from 'src/app/interfaces/models';

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    directives: IDirective[] = [];
    loading: any;
    imgLoaded = false;

    constructor(
        private utilsService: UtilsService,
        private directivesService: DirectivesService,
        private postService: PostsService
    ) { }

    async ngOnInit() {
        this.directivesService.getDirectives().subscribe(response => {
            if (response) {
                // if (response.data.avatar !== null) {
                const imagesPath = response.data.filter(user => {
                    console.log('user', user);
                    return user.avatar !== null;
                }).map(el => {
                    console.log('el', el);
                    return el.avatar;
                });
                Preloader.preloadImages({
                    images: imagesPath,
                    completed: () => {
                        // setTimeout(() => {
                        this.directives = response.data;
                        // }, 2500);
                    }
                });
                // }

            }
        });
    }

    imageWasLoaded() {
        this.imgLoaded = true;
    }

}
