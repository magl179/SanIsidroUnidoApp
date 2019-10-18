import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { UtilsService } from "src/app/services/utils.service";
import { IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { mapImagesApi } from "src/app/helpers/utils";
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
        private navCtrl: NavController,
        private utilsService: UtilsService
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
    
    loadReports(event?: any, resetReports?: any) {
        this.reportsLoaded = false;
        if (resetReports) {
            this.reportsList = [];
        }
        this.postsService.getReports().pipe(
            map((res: any) => {
                if (res && res.data && res.data.data) {
                    const reports_to_map = res.data.data;
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
            this.reportsList = res.data.data;
            this.reportsList.forEach((report: any) => {
                report.fulldate = `${report.date} ${report.time}`;
                if (report.images && report.images.length > 0) {
                    report.images = mapImagesApi(report.images);
                }
            });
            console.log('reports list', this.reportsList);
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

}
