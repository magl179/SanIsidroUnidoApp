import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { mapReport } from "../../helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit, OnDestroy {

    reportsList: any = [];
    reportsLoaded = false;

    constructor(
        private postsService: PostsService,
        private navCtrl: NavController
  ) { }
    
    ngOnInit() { 
        this.postsService.resetReportsPage();
        this.loadReports();
    }

    ngOnDestroy() {
        console.warn('REPORTS  PAGE DESTROYED')
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/report-detail/${id}`);
    }
    
    loadReports(event?: any) {
        this.reportsLoaded = false;
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
                this.reportsLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {            
            let reportsList = [];
            reportsList = res.data;
            if (reportsList.length === 0) {
                if (event) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } 
            if (event) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.reportsList.unshift(...reportsList);
                // console.log('reports list', this.reportsList);
                return;
            }
            this.reportsList.push(...reportsList);
            // console.log('reports list', this.reportsList);
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
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
