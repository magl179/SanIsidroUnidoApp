import { Component, OnInit } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { UtilsService } from "../../../services/utils.service";
import { IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

    reportsList: any = [];
    reportsLoaded = false;

    constructor(
        private postsService: PostsService,
        private navCtrl: NavController,
        private utilsService: UtilsService
  ) { }

    ionViewWillEnter() {
        console.log('reports will enter');
        this.loadReports();
    }
    
    ngOnInit() { }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/report-detail/${id}`);
    }
    
    loadReports(event?: any, resetReports?: any) {
        this.reportsLoaded = false;
        console.log('llamdo get reports');
        if (resetReports) {
            this.reportsList = [];
        }
        this.postsService.getReports().pipe(
            finalize(() => {
                this.reportsLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            this.reportsList = res.data.data;
            this.reportsList.forEach((report: any) => {
                report.fulldate = `${report.date} ${report.time}`;
                if (report.images && report.images.length > 0) {
                    report.images = this.utilsService.mapImagesApi(report.images);
                }
            });
            // console.log(res);
            console.log('reports list', this.reportsList);
        }, (err: any) => {
            console.log('Ocurrio un error al traer el listado de reportes', err);
        });
    }

}
