import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";

@Component({
  selector: 'app-public-services-categories',
  templateUrl: './public-services-categories.page.html',
  styleUrls: ['./public-services-categories.page.scss'],
})
export class PublicServicesCategoriesPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  items = [
    { title: 'Carpinteria', image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/bot.svg?sanitize=true', color: 'primary' },
    { title: 'Tiendas',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/envelope.svg?sanitize=true',color: 'secondary' },
    { title: 'Cajeros',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/headset.svg?sanitize=true',color: 'tertiary' },
    { title: 'Centros Médicos',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/imac.svg?sanitize=true',color: 'warning' },
    { title: 'Farmacias',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/internet.svg?sanitize=true',color: 'warning' },
    { title: 'Fruterias',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/letter.svg?sanitize=true',color: 'warning' }
];

  ngOnInit() {
  }
    
    goToList() {
        console.log('navegar ps')
      this.navCtrl.navigateForward('/public-services')
  }

}
