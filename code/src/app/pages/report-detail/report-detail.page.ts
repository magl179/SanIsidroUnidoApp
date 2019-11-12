import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PostsService } from "src/app/services/posts.service";
import { finalize, map, take } from 'rxjs/operators';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { UtilsService } from "src/app/services/utils.service";
import { mapReport } from "../../helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { ManageDocsService } from '../../services/manage-docs.service';
import { environment } from 'src/environments/environment';

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
        private manageDocsService: ManageDocsService,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {

        this.id = this.route.snapshot.paramMap.get('id');
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.getReport();
    }

    getReport(event?: any, resetEvents?: any) {
        this.reportLoaded = false;
        this.postsService.getReport(+this.id).pipe(
            take(1),
            map((res: any) => {
                if (res && res.data) {
                    const report = res.data;
                    res.data = mapReport(report);
                }
                return res;
            }),
            finalize(() => {
            this.reportLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            this.report = res.data;
            console.log('Dato post', this.report);
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    getBGCover(image_cover: any) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
    }

    seeImageDetail(image: string) {
        console.log('see image', image)
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

    openReportPDF() {
        this.manageDocsService.downloadAndOpenPDF(`${environment.apiBaseURL}/pdf/javascript.pdf`);
    }

}
