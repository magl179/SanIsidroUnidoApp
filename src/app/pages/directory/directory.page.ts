import { Component, OnInit } from '@angular/core';
import { DirectivesService } from 'src/app/services/directives.service';
import { IRespuestaApiSIU } from 'src/app/interfaces/models';
import { finalize, take, tap, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
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
            distinctUntilChanged(),
        )
        .subscribe(search => {
            if(search == ''){
                this.directivesFilter = [... this.directivesList]
            }else{
                const searchValue = search.toLowerCase();
                this.directivesFilter = [...this.directivesList].filter(directive => {
                    const firstname = directive.first_name.toLowerCase();
                    const lastname = directive.last_name.toLowerCase();
                    return (firstname.indexOf(searchValue) > -1) || (lastname.indexOf(searchValue) > -1 );
                });
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
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al traer el listado de directivos', false);
        });
    }
    

}
