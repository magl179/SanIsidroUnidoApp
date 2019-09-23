import { Component, OnInit } from '@angular/core';
import { PostsService } from "../../../services/posts.service";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

    reportsList = [];
    reportsLoaded = false;

    constructor(
      private postsService: PostsService
  ) { }

    ngOnInit() {
        this.loadReports();
  }
    
    loadReports() {
        this.reportsLoaded = false;
        this.postsService.getReports().pipe(
            finalize(() => {
                this.reportsLoaded = true;
            })
        ).subscribe((res: any) => {
            this.reportsList = res.data;
        }, err => {
            console.log('Ocurrio un error al traer el listadode reportes', err);
        });
    }

}
