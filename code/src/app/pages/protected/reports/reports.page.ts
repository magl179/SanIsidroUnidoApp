import { Component, OnInit } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

    reportsList: any = [];
    reportsLoaded = false;

    constructor(
      private postsService: PostsService
  ) { }

    ionViewWillEnter() {
        console.log('reports will enter');
        this.loadReports();
    }
    
    ngOnInit() { }
    
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
        ).subscribe(res => {
            this.reportsList = res.data.data;
            // console.log(res);
            console.log('reports list', this.reportsList);
        }, (err: any) => {
            console.log('Ocurrio un error al traer el listado de reportes', err);
        });
    }

}
