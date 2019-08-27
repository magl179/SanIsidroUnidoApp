import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { MenuController, NavController } from '@ionic/angular';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.page.html',
    styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

    @ViewChild('tutorialSlider') tutorialSlider: any;

    smSlidesOpts: {
        loop: true
    };


    slides: { img: string, title: string, desc: string }[] = [
        {
            img: '/assets/img/svg/sanIsidroIcon.svg',
            title: 'San Isidro Unido',
            // tslint:disable-next-line: max-line-length
            desc: 'Bienvenido! Ahora puedes hacer más para informarte y participar en tu comunidad, aquí te enseñamos como.'
        },
        {
            img: '/assets/img/svg/add-documents.svg',
            title: 'Crear',
            // tslint:disable-next-line: max-line-length
            desc: 'Aqúi puedes crear reportes de emergencia y/o problemas sociales para informar o solicitar ayuda, por ejemplo en un robo, cuando veas alguna persona extraña rondando por tu domicilio o una calle con algún problema.'
        },
        {
            img: '/assets/img/svg/user_profile.svg',
            title: 'Mi Perfil',
            // tslint:disable-next-line: max-line-length
            desc: 'Aquí puedes editar tus datos de contacto, cambiar tu imagen y contraseña además de en caso de no ser un morador afiliado, solicitar la afiliación.'
        },
        {
            img: '/assets/img/svg/people.svg',
            // tslint:disable-next-line: max-line-length
            title: 'Directorio Barrial',
            desc: 'Aquí se muestran los datos personales de los miembros de la directiva para que puedas contactarlos.'
        },
        {
            img: '/assets/img/svg/map.svg',
            title: 'Servicios Públicos',
            // tslint:disable-next-line: max-line-length
            desc: 'Aquí se muestra un mapa con los lugares donde estan ubicados los servicios publicos registrados junto a información de cada servicio.'
        },
        {
            img: '/assets/img/svg/report_paper.svg',
            title: 'Publicaciones',
            desc: 'Aquí podrás ver los problemas sociales y los eventos que son publicados por la comunidad y la directiva respectivamente.'
        },
    ];

    constructor(
        private menuCtrl: MenuController,
        private navCtrl: NavController) { }

    ngOnInit() {
    }

    closeMenu() {
        this.menuCtrl.close();
    }

    async startTutorial() {
        await this.closeMenu();
        timer(300).subscribe(() => {
            this.navCtrl.navigateRoot('/home');
        });
    }

}
