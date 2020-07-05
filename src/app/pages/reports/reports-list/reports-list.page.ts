import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize, map, catchError, tap, distinctUntilChanged, exhaustMap, pluck } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { IRespuestaApiSIUPaginada, IReport, IEventLoad } from 'src/app/interfaces/models';
import { mapReport } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { CONFIG } from 'src/config/config';

interface BodyRequest {
    category: string;
    title: string;
}

@Component({
    selector: 'app-reports-list',
    templateUrl: './reports-list.page.html',
    styleUrls: ['./reports-list.page.scss'],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),
                query(':enter', stagger('300ms', [
                    animate('1s ease-in', keyframes([
                        style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
                        style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
                        style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
                    ]))]), { optional: true }),
            ])
        ])
    ]
})
export class ReportsListPage implements OnInit, OnDestroy {

    requestStatus = '';
    reportsList: IReport[] = [];
    reportsFiltered: IReport[] = [];
    socialActivityControl: FormControl;

    constructor(
        private postsService: PostsService,
        private navCtrl: NavController,
        private router: Router,
        private errorService: ErrorService,
    ) {
        this.socialActivityControl = new FormControl();
    }

    imgError(event, url: string = 'assets/img/default/image_full.png'): void {
        event.target.src = url;
    }

    ngOnInit() {

        const peticionHttpBusqueda = (body: BodyRequest) => {
            if (body.title == '') {
                return of([...this.reportsList])
            }
            return this.postsService.searchPosts(body)
                .pipe(
                    pluck('data'),
                    map(data => {
                        const reports_to_map = data
                        reports_to_map.forEach((report) => {
                            report = mapReport(report);
                        });
                        return reports_to_map;
                    }),
                    catchError((error_http) => {
                        this.errorService.manageHttpError(error_http, '');
                        return of([])
                    })
                )
        }

        this.postsService.resetPagination(this.postsService.PaginationKeys.REPORTS);
        
        this.loadReports(null, true);

        this.socialActivityControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                tap(() => {
                    this.requestStatus = 'loading';
                }),
                map(search => ({
                    category: CONFIG.REPORTS_SLUG,
                    title: search
                })),
                exhaustMap(peticionHttpBusqueda),
            )
            .subscribe((data: IReport[]) => {
                this.requestStatus = '';
                this.reportsFiltered = [...data];
                if(this.reportsFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
            });
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/reports/list/${id}`);
    }

    ngOnDestroy() {
        this.postsService.resetPagination(this.postsService.PaginationKeys.REPORTS);
    }

    loadReports(event: IEventLoad = null, first_loading = false) {
        this.requestStatus = 'loading';
        this.postsService.getReports().pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    const reports_to_map = res.data;
                    reports_to_map.forEach((report) => {
                        report = mapReport(report);
                    });
                }
                if (res && res.data && res.data.length == 0) {
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.REPORTS)
                }
                return res;
            }),
            catchError((error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'Ocurrio un error al traer el listado de actividades barriales', false);
                this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.REPORTS);
                return of({ data: [] })
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let reportsList = [];
            reportsList = res.data;
            this.requestStatus = '';
            //Evento Completar
            if (event && event.data && event.data.target && event.data.target.complete) {
                event.data.target.complete();
            }
            if (event && event.data && event.data.target && event.data.target.complete && reportsList.length == 0) {
                event.data.target.disabled = true;
            }
            //Cargar Datos
            if (event && event.type === 'refresher') {
                this.reportsList.unshift(...reportsList);
                this.reportsFiltered.unshift(...reportsList);
                if(this.reportsFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
                return;
            } else if (event && event.type == 'infinite_scroll') {
                this.reportsList.push(...reportsList);
                this.reportsFiltered.push(...reportsList);
                if(this.reportsFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
                return;
            } else {
                this.reportsList.push(...reportsList);
                this.reportsFiltered.unshift(...reportsList);
                if(this.reportsFiltered.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
                return;
            }
        });
    }

    //Obtener datos con el Infinite Scroll
    doInfiniteScroll(event: CustomEvent) {
        this.loadReports({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: CustomEvent) {
        this.loadReports({
            type: 'refresher',
            data: event
        });
    }

}
