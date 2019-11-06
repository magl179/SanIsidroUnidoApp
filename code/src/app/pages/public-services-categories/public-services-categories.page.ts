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
    { title: 'Carpinteria', image: 'http://localhost/resources/svg/chat.svg', color: 'primary' },
    { title: 'Tiendas',  image: 'http://localhost/resources/svg/envelope.svg',color: 'secondary' },
    { title: 'Cajeros',  image: 'http://localhost/resources/svg/headset.svg',color: 'tertiary' },
    { title: 'Centros Médicos',  image: 'http://localhost/resources/svg/imac.svg',color: 'warning' },
    { title: 'Farmacias',  image: 'http://localhost/resources/svg/internet.svg',color: 'warning' },
    { title: 'Fruterias',  image: 'http://localhost/resources/svg/letter.svg',color: 'warning' },
    // { title: '', color: 'dark' },
    // { title: '', color: 'success' },
    // { title: '', color: 'light' },
    // { title: '', color: 'medium' },
    // { title: '', color: 'orange' }
];

  ngOnInit() {
  }
    
    goToList() {
        console.log('navegar ps')
      this.navCtrl.navigateForward('/public-services')
  }

}
