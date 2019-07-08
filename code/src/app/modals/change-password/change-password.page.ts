import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    passwordTypeInput = 'password';
    iconpassword = 'eye-off';
    passwordConfirmTypeInput = 'password';
    iconConfirmpassword = 'eye-off';
    @ViewChild('passwordEyeChangePass') passwordEye;
    @ViewChild('passwordConfirmEyeChangePass') passwordConfirmEye;
    constructor(
        private modalCtrl: ModalController
    ) { }

    ngOnInit() {
    }

    togglePasswordMode() {
        this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
        this.iconpassword = this.iconpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordEye.el.setFocus();
    }

    toggleConfirmPasswordMode() {
        this.passwordConfirmTypeInput = this.passwordConfirmTypeInput === 'text' ? 'password' : 'text';
        this.iconConfirmpassword = this.iconConfirmpassword === 'eye-off' ? 'eye' : 'eye-off';
        // console.log(this.passwordEye);
        this.passwordConfirmEye.el.setFocus();
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

}
