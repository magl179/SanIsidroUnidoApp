import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loader-app',
  templateUrl: './loading-app.component.html',
  styleUrls: ['./loading-app.component.scss'],
})
export class LoadingAppComponent implements OnInit {

    @Input() message = 'Cargando...'
  constructor() { }

  ngOnInit() {}

}
