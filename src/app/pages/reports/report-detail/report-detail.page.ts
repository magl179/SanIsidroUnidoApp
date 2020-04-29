import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { PostsService } from "src/app/services/posts.service";
import { finalize, map, take } from 'rxjs/operators';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { UtilsService } from "src/app/services/utils.service";
import { mapReport } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { ManageDocsService } from 'src/app/services/manage-docs.service';
import { ErrorService } from 'src/app/services/error.service';
import { IReport } from 'src/app/interfaces/models';

@Component({
    selector: 'app-report-detail',
    templateUrl: './report-detail.page.html',
    styleUrls: ['./report-detail.page.scss'],
})
export class ReportDetailPage implements OnInit {

    id: string;
    AuthUser = null;
    report: IReport = null;
    reportLoaded = false;

    constructor(
        private route: ActivatedRoute,
        private errorService: ErrorService,
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
        },(err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al traer el detalle del reporte');
        });
    }

    seeImageDetail(image: string) {
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

    openReportPDF(document=null) {
        const pdfs = [
            "https://siu-dev97-sd.s3-sa-east-1.amazonaws.com/CursoPugDesdeCero.pdf", //funciona
        ];
        if(!document){
            const position = this.randomInteger(0, (pdfs.length -1));
            return this.manageDocsService.downloadAndOpenPDF(pdfs[position]);
        }
        this.manageDocsService.downloadAndOpenPDF(document);
        // const urlPDFDrive = "https://drive.google.com/file/d/1P-_obHcrIOYauf-zuQ830E5EtuTPCxI9/view";
    }

    randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
