import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title = '') {
    return this.toastr.success(message, title);
  }

  showInfo(message: string, title = '') {
    return this.toastr.info(message, title);
  }

  showPersistenceNoti(message: string, title = ''){
    return this.toastr.info(message, title, {
        closeButton: true,
        timeOut: 90000,
        positionClass: 'toast-top-right',
        tapToDismiss: false
    });
  }

  showWarning(message: string, title = '') {
    return this.toastr.warning(message, title);
  }

  showError(message: string, title = '') {
    return this.toastr.error(message, title);
  }
}
