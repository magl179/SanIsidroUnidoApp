import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { UtilsService } from './utils.service';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class ManageDocsService {

    constructor(
        private platform: Platform,
        private file: File,
        private fileTransfer: FileTransfer,
        private fileOpener: FileOpener,
        private documentViewer: DocumentViewer,
        private messagesService: MessagesService,
        private utilsService: UtilsService,
  ) { }

    downloadAndOpenPDF($url_path_file_pdf: string) {
        let path = this.file.dataDirectory;
        this.messagesService.showInfo(`Descargando Documento por favor espere...`);
        this.messagesService.showInfo(`URL PDF: ${$url_path_file_pdf}`);
        let filename = $url_path_file_pdf.replace(/^.*[\\\/]/, '');
        if (this.platform.is('cordova')) {
            const transfer = this.fileTransfer.create();
            transfer.download($url_path_file_pdf, path + filename).then(entry => {
                let url = entry.toURL();
                if (this.platform.is('ios')) {
                    this.documentViewer.viewDocument(url, 'application/pdf', {});
                } else {
                    this.fileOpener.open(url, 'application/pdf');
                }
            }).catch(err => {
                console.error('Ocurrio un error al descargar el archivo');
            })
        } else {
            this.utilsService.openInBrowser($url_path_file_pdf);
        }
    }
}
