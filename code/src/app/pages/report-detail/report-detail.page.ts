import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PostsService } from "src/app/services/posts.service";
import { finalize } from 'rxjs/operators';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { UtilsService } from "src/app/services/utils.service";
import { getJSON, mapImagesApi } from "src/app/helpers/utils";

@Component({
    selector: 'app-report-detail',
    templateUrl: './report-detail.page.html',
    styleUrls: ['./report-detail.page.scss'],
})
export class ReportDetailPage implements OnInit {

    id: string;
    AuthUser = null;
    report = null;
    reportLoaded = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private postsService: PostsService,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');
        console.log('ID RECIBIDO:', this.id);
        // this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
        //     this.appNetworkConnection = connected;
        // });
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.getReport();
    }

    getReport(event?: any, resetEvents?: any) {
        this.reportLoaded = false;
        this.postsService.getReport(+this.id).pipe(finalize(() => {
            this.reportLoaded = true;
        })).subscribe((res: IRespuestaApiSIUSingle) => {
            this.report = res.data;
            if (this.report.images && this.report.images.length > 0) {
                this.report.images = mapImagesApi(this.report.images);
                // this.report.fulldate = `${this.report.date} ${this.report.time}`;
            }
            this.report.ubication = getJSON(this.report.ubication);
            this.report.fulldate = `${this.report.date} ${this.report.time}`;
            console.log('Dato post', this.report);
        });
    }

    getBGCover(image_cover: any) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
    }

    seeImageDetail(image: string) {
        console.log('see image', image)
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

}
