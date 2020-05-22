import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { UtilsService } from './utils.service';
import { MessagesService } from './messages.service';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ManageDocsService {

    constructor(
        private platform: Platform,
        private file: File,
        private fileTransfer: FileTransfer,
        private errorService: ErrorService,
        private fileOpener: FileOpener,
        private documentViewer: DocumentViewer,
        private messagesService: MessagesService,
        private utilsService: UtilsService,
  ) { }

    downloadAndOpenPDF($url_path_file_pdf: string) {
        let path = this.file.dataDirectory;
        this.messagesService.showInfo(`Descargando Documento por favor espere...`);
        let filename = $url_path_file_pdf.replace(/^.*[\\\/]/, '');
        if (this.platform.is('cordova')) {
            const transfer = this.fileTransfer.create();
            transfer.download($url_path_file_pdf, path + filename).then(entry => {
                let url = entry.toURL();
                
                if (this.platform.is('ios')) {
                    this.messagesService.showInfo(`Archivo descargado correctamente.`);
                    this.documentViewer.viewDocument(url, 'application/pdf', {});
                } else {
                    this.messagesService.showInfo(`Archivo descargado correctamente.`);
                    this.fileOpener.open(url, 'application/pdf');
                }
            }).catch(error_http => {
                this.errorService.manageHttpError(error_http, 'No pudimos descargar el archivo, intentalo más tarde.', false);
            })
        } else {
            this.utilsService.openInBrowser($url_path_file_pdf);
        }
    }
}
