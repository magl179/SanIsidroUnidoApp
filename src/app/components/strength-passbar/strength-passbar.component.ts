import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-strength-passbar',
    templateUrl: './strength-passbar.component.html',
    styleUrls: ['./strength-passbar.component.scss'],
})
export class StrengthPassbarComponent implements OnInit {

    @Input() align = 'right';
    @Input() width = 100;
    @Input() set text(text: string) {
        this.score = 5;
        this.passText = text;
        this.isEmptyPass = (text !== '') ? false : true;
      }
    barLevels = [
        { color: '#a1a1a1', title: 'Muy Baja', percent: 0.2 },
        { color: '#f04141', title: 'Baja', percent: 0.4 },
        { color: '#FF6D00', title: 'Normal' , percent: 0.6},
        { color: '#AEEA00', title: 'Alta' , percent: 0.8},
        { color: '#10dc60', title: 'Muy Alta', percent: 1 },
    ];
    barLabel: string;
    score = 0;
    isEmptyPass = true;
    passText = '';

    constructor() {
    }


    async ngOnInit() {}

}
