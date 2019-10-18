import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { DirectivesService } from 'src/app/services/directives.service';
import { IDirective, IRespuestaApiSIU } from 'src/app/interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { finalize, map, take } from 'rxjs/operators';
import { mapUser} from 'src/app/helpers/utils';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-directory-info',
    templateUrl: './directory-info.page.html',
    styleUrls: ['./directory-info.page.scss'],
})
export class DirectoryInfoPage implements OnInit {

    directivesList: IDirective[] = [];
    loading: any;
    loadDirectives = false;

    constructor(
        private directivesService: DirectivesService,
    ) { }

    async ngOnInit() {
        this.loadDirectoryInfo();
    }

    loadDirectoryInfo() {
        this.loadDirectives = false;
        this.directivesService.getDirectives().pipe(
            take(1),
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
            console.log('directives length', this.directivesList.length)
        },err => {
            console.log('Error al traer directivos');
        });
    }
}
