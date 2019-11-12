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
    { title: 'Ferreterias', image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/ironmongery.svg?sanitize=true', color: 'primary' },
    { title: 'Tiendas',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/store.svg?sanitize=true',color: 'secondary' },
    { title: 'Cajeros',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/cashier-machine.svg?sanitize=true',color: 'tertiary' },
    { title: 'Centros Médicos',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/hospital.svg?sanitize=true',color: 'warning' },
    { title: 'Farmacias',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/medicine.svg?sanitize=true',color: 'warning' },
    { title: 'Restaurantes',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/baker.svg?sanitize=true',color: 'warning' },
    { title: 'Hospedaje',  image: 'https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/svg/hotel.svg?sanitize=true',color: 'warning' }
];

  ngOnInit() {
  }
    
    goToList() {
        console.log('navegar ps')
      this.navCtrl.navigateForward('/public-services')
  }

}
