import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize, map, catchError } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { IRespuestaApiSIUPaginada, IReport } from 'src/app/interfaces/models';
import { mapReport } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.page.html',
  styleUrls: ['./reports-list.page.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), {optional: true}),
        query(':enter', stagger('300ms', [
          animate('1s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true}),
      ])
    ])
  ]
})
export class ReportsListPage implements OnInit, OnDestroy {

    reportsList: IReport[] = [];
    showLoading = true;
    showNotFound = false;

    constructor(
        private postsService: PostsService,
        private navCtrl: NavController,
        private router: Router,
        private errorService: ErrorService,
  ) { }
    
    ngOnInit() { 
        this.postsService.resetPagination(this.postsService.PaginationKeys.REPORTS);
        this.loadReports(null, true);
    }

    redirectToSearch(){
        this.navCtrl.navigateRoot("/reports/search", {
            queryParams: { redirectUrl: this.router.url }
        });
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/reports/list/${id}`);
    }

    ngOnDestroy() { 
        this.postsService.resetPagination(this.postsService.PaginationKeys.REPORTS);
    }
    
    loadReports(event: any = null, first_loading=false) {
        this.postsService.getReports().pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    const reports_to_map = res.data;
                    reports_to_map.forEach((report: any) => {
                        report = mapReport(report);
                    });
                }
                if(res && res.data && res.data.length == 0){
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.REPORTS)
                }
                return res;
            }),
            catchError((err: HttpErrorResponse)=>{
                this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de actividades barriales', false);
                this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.REPORTS);
                return of({data: []})
            }),
            finalize(() => {
                if(first_loading){
                    this.showLoading = false;
                }
                if(first_loading && this.reportsList.length === 0){
                    this.showNotFound = true;
                }
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {            
            let reportsList = [];
            reportsList = res.data;
             //Evento Completar
             if(event && event.data && event.data.target && event.data.target.complete){
                event.data.target.complete();
            }         
            if(event && event.data && event.data.target && event.data.target.complete && reportsList.length == 0){
                event.data.target.disabled = true;
            }  

            if (event && event.type === 'refresher') {
                return this.reportsList.unshift(...reportsList);
            }else if(event && event.type == 'infinite_scroll'){
                return this.reportsList.push(...reportsList);
            }else{
                return this.reportsList.push(...reportsList);
            }
        });
    }

    //Obtener datos con el Infinite Scroll
    doInfiniteScroll(event: any) {
        this.loadReports({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: any) {
        this.loadReports({
            type: 'refresher',
            data: event
        });
    }

}
