import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
import { IDirective, IRespuestaApiSIU } from 'src/app/interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getImageURL } from 'src/app/helpers/utils';
import { Subscription } from 'rxjs';

const URL_PATTERN = new RegExp(/^(http[s]?:\/\/){0,1}(w{3,3}\.)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/);

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    directoryObservable$: Subscription;
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
        this.directoryObservable$ = this.directivesService.getDirectives().pipe(
            finalize(() => {
                this.loadDirectives = true;
            })
        ).subscribe((response: IRespuestaApiSIU) => {
                // if (response.data.avatar !== null) {
            const directives = response.data;
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

    getAvatar(image_name: string) {
        return getImageURL(image_name);
    }

    ionViewWillLeave() {
        this.directoryObservable$.unsubscribe();
    }

}
