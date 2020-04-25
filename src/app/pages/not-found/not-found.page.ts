import { Component, OnInit } from '@angular/core';
import { CONFIG } from 'src/config/config';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
})
export class NotFoundPage implements OnInit {

    urlRedirect = `/${CONFIG.HOME_ROUTE}`;

  constructor() { }

  ngOnInit() {}

}
