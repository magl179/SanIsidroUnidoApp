import { Component, OnInit } from '@angular/core';
import { DirectivesService } from 'src/app/services/directives.service';
import { IDirective, IRespuestaApiSIU } from 'src/app/interfaces/models';
import { finalize, take, debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
})
export class DirectoryPage implements OnInit {

    loadDirectives = false;
    directivesList: any[] = [];
    directivesFilter: any[] = [];
    directorySearchControl: FormControl;
    searchingDirectives = false;

    constructor(
        private directivesService: DirectivesService,
        private utilsService: UtilsService,
        private messageService: MessagesService,
        private errorService: ErrorService
    ) {
        this.directorySearchControl = new FormControl();
     }

    async ngOnInit() {
        this.loadDirectoryInfo();
        this.directorySearchControl.valueChanges
        .pipe(
            tap(() => {
                this.searchingDirectives = true;
            }),
            // debounceTime(300),
            distinctUntilChanged(),
        )
        .subscribe(search => {
            if(search == ''){
                this.directivesFilter = [... this.directivesList]
            }else{
                this.directivesFilter = [...this.directivesList].filter(directive => (directive.first_name.toLowerCase().indexOf(search) > -1) || (directive.last_name.toLowerCase().indexOf(search) > -1 ))
            }
            this.searchingDirectives = false;
        });
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
            this.directivesFilter = response.data;
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de directivos', false);
        });
    }
    

}
