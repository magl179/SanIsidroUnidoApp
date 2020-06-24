import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MessagesService } from 'src/app/services/messages.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CONFIG } from 'src/config/config';

@Component({
  selector: 'app-social-email-login-modal',
  templateUrl: './social-email-login.modal.html',
  styleUrls: ['./social-email-login.modal.scss'],
})
export class SocialEmailLoginModal implements OnInit {

  public title: string = '';
  socialEmailLoginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    private utilsService: UtilsService,
    private modalCtrl: ModalController
  ) {
    this.createForm();
  }

  ngOnInit() { }

  createForm(): void {
    //Cargar Validaciones
    const email = new FormControl('', Validators.compose([
      Validators.required,
      Validators.email
    ]));
    // Añado Propiedades al Form
    this.socialEmailLoginForm = this.formBuilder.group({ email });
  }

  submitForm() {
    if(!this.socialEmailLoginForm.valid){
      return this.messagesService.showWarning('Debes ingresar una dirección de correo');
    }
    
    this.modalCtrl.dismiss(this.socialEmailLoginForm.value);
  }

 preventEnterPressed($event: KeyboardEvent): void {
    $event.preventDefault()
    $event.stopPropagation()
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  openLink(){
    this.utilsService.openInBrowser(CONFIG.URL_SOCIAL_LOGIN_NOT_EMAIL)
  }

}
