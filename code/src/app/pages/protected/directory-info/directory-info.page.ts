import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
// import { trigger, style, state, query, stagger, animate, transition } from '@angular/animations';
import Preloader from 'src/app/helpers/preloader-image';
import { PostsService } from '../../../services/posts.service';
import { IDirective, IRespuestaApiSIU } from 'src/app/interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    directivesList: IDirective[] = [];
    loading: any;
    imgLoaded = false;
    loadDirectives = false;
    appNetworkConnection = false;

    constructor(
        private utilsService: UtilsService,
        private directivesService: DirectivesService,
        // private postService: PostsService,
        private networkService: NetworkService
    ) { }

    async ngOnInit() {
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        this.loadDirectoryInfo();
    }

    loadDirectoryInfo() {
        this.loadDirectives = false;
        this.directivesService.getDirectives().pipe(
            finalize(() => {
                this.loadDirectives = true;
            })
        ).subscribe((response: IRespuestaApiSIU) => {
                // if (response.data.avatar !== null) {
            const directives = response.data;
            directives.forEach((directive) => {
                directive.avatar = this.getImageURL(directive.avatar);
            });
            this.directivesList = directives;
                // const imagesPath = response.data.filter(user => {
                //     console.log('user', user);
                //     return user.avatar !== null;
                // }).map(el => {
                //     console.log('el', el);
                //     return el.avatar;
                // });
                // Preloader.preloadImages({
                //     images: imagesPath,
                //     completed: () => {
                //         // setTimeout(() => {
                //         this.directivesList = response.data;
                //         // }, 2500);
                //     }
                // });
        },err => {
            console.log('Error al traer directivos');
            this.utilsService.showToast('No se pudieron cargar los directivos');
        });
    }

    imageWasLoaded() {
        this.imgLoaded = true;
    }

    getImageURL(image_name: string) {
        if (image_name) {     
            const imgIsURL = URL_PATTERN.test(image_name);
            if (imgIsURL) {
                return image_name;
            } else {
                return `${environment.apiBaseURL}/${environment.image_assets}/${image_name}`;
            }
        } else {
            return "";
        }
    }

}
