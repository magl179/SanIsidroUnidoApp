import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { mapReport } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.page.html',
  styleUrls: ['./reports-list.page.scss'],
})
export class ReportsListPage implements OnInit, OnDestroy {

    reportsList: any = [];
    showLoading = true;
    showNotFound = false;

    constructor(
        private postsService: PostsService,
        private navCtrl: NavController,
        private errorService: ErrorService,
  ) { }
    
    ngOnInit() { 
        this.postsService.resetReportsPage();
        this.loadReports(null, true);
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/reports/list/${id}`);
    }

    ngOnDestroy() { }
    ionViewWillLeave() { this.postsService.resetReportsPage(); }
    
    loadReports(event: any = null, first_loading=false) {
        this.postsService.getReports().pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    const reports_to_map = res.data;
                    reports_to_map.forEach((report: any) => {
                        report = mapReport(report);
                    });
                }
                return res;
            }),
            finalize(() => {
                if(first_loading){
                    this.showLoading = false;
                }
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {            
            let reportsList = [];
            reportsList = res.data;

            if(first_loading && res.data.length === 0){
                this.showNotFound = true;
            }

            if (reportsList.length === 0) {
                if (event && event.data && event.data.target) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } 
            if (event && event.data && event.data.target) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.reportsList.unshift(...reportsList);
                return;
            }else if(event && event.type == 'infinite_scroll'){
                this.reportsList.push(...reportsList);
            }else{
                this.reportsList.push(...reportsList);
            }
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de informes');
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
