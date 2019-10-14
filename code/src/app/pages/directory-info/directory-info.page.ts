import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
import { IDirective, IRespuestaApiSIU } from 'src/app/interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { finalize, map } from 'rxjs/operators';
import { getImageURL, mapUser} from 'src/app/helpers/utils';
import { Subscription } from 'rxjs';

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
            map((res: any) => {
                // console.log('res map', res);
                if (res && res.data) {
                    // const directives_to_map = res.data;
                    res.data.forEach((directive: any) => {
                        directive = mapUser(directive);
                    });
                }
                console.log('res maped', res.data);
                return res;
            }),
            finalize(() => {
                this.loadDirectives = true;
            })
        ).subscribe((response: IRespuestaApiSIU) => {
            const directives = response.data;
            this.directivesList = directives;
        },err => {
            console.log('Error al traer directivos');
            this.utilsService.showToast('No se pudieron cargar los directivos');
        });
    }

    imageWasLoaded() {
        this.imgLoaded = true;
    }
    
    ionViewWillLeave() {
        this.directoryObservable$.unsubscribe();
    }

}
