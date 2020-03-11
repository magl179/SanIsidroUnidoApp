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
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/app/services/error.service';
import { IReport } from '../../../interfaces/models';

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

    openReportPDF() {
        // const urlPDFApi = `${environment.APIBASEURL}/pdf/javascript.pdf`;
        const pdfs = [
            "https://drive.google.com/file/d/1P-_obHcrIOYauf-zuQ830E5EtuTPCxI9/view", //error
            "https://rua.ua.es/dspace/bitstream/10045/2990/1/ApuntesBD1.pdf", //sin_probar
            "http://artemisa.unicauca.edu.co/~cardila/Libro_Silberschatz.pdf", //sin_probar
            "https://libros.metabiblioteca.org/bitstream/001/353/5/978-84-693-0146-3.pdf", //funciona
            `${environment.APIBASEURL}/pdf/javascript.pdf` //error
        ];
        // const pdfs_new = [
        //     "http://www.cursogis.com.ar/BasesP/Zip/Base_Clase1.pdf",  //demora cargar
        //     "http://bibliotecadigital.univalle.edu.co/bitstream/10893/10313/3/Fundamentos%20de%20Bases%20de%20Datos.pdf", //demora cargar
        // ];
        // const urlPDFDrive = "https://drive.google.com/file/d/1P-_obHcrIOYauf-zuQ830E5EtuTPCxI9/view";
        const position = this.randomInteger(0, (pdfs.length -1));
        this.manageDocsService.downloadAndOpenPDF(pdfs[position]);
    }

    randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}
