import { Component, OnInit } from '@angular/core';
import { DirectivesService } from 'src/app/services/directives.service';
import { IDirective, IRespuestaApiSIU } from 'src/app/interfaces/models';
import { finalize, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
    selector: 'app-directory-list',
    templateUrl: './directory-list.page.html',
    styleUrls: ['./directory-list.page.scss'],
})
export class DirectoryListPage implements OnInit {

    directivesList: IDirective[] = [];
    loadDirectives = false;

    constructor(
        private directivesService: DirectivesService,
        private utilsService: UtilsService,
        private errorService: ErrorService
    ) { }

    async ngOnInit() {
        this.loadDirectoryInfo();
    }

    loadDirectoryInfo() {
        this.loadDirectives = false;
        this.directivesService.getDirectives().pipe(
            take(1),
            finalize(() => {
                this.loadDirectives = true;
            })
        ).subscribe((response: IRespuestaApiSIU) => {
            this.directivesList = response.data;
            console.log('directives length', this.directivesList.length)
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de directivos');
        });
    }
}