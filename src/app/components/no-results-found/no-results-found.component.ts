import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-no-results-found',
  templateUrl: './no-results-found.component.html',
  styleUrls: ['./no-results-found.component.scss'],
})
export class NoResultsFoundComponent implements OnInit {

    @Input() message: string = 'No hay resultados que coincidan con la búsqueda'

  constructor() { }

  ngOnInit() {}

}
