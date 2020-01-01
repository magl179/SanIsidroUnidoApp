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


  showWarning(message: string, title = '') {
    return this.toastr.warning(message, title);
  }

  showError(message: string, title = '') {
    return this.toastr.error(message, title);
  }
}
