import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emergencies-tabs',
  templateUrl: './emergencies-tabs.page.html',
  styleUrls: ['./emergencies-tabs.page.scss'],
})
export class EmergenciesTabsPage implements OnInit {

  constructor() { }

  ngOnInit() {
    }
    
    openSearchModal(){
    console.log('open modal');
    }

}
