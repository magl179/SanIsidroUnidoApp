import { Component, OnInit, Input } from '@angular/core';
// const zxcvbn;
declare var zxcvbn: any;

@Component({
    selector: 'app-strength-passbar',
    templateUrl: './strength-passbar.component.html',
    styleUrls: ['./strength-passbar.component.scss'],
})
export class StrengthPassbarComponent implements OnInit {

    @Input() align = 'right';
    @Input() width = 100;
    @Input() set text(text: any[]) {
        this.score = zxcvbn(text).score;
      }
    barLevels = [
        { color: '#a1a1a1', title: 'Muy Débil' },
        { color: '#f04141', title: 'Débil' },
        { color: '#FF6D00', title: 'Normal' },
        { color: '#AEEA00', title: 'Segura' },
        { color: '#10dc60', title: 'Muy Segura' },
    ];
    barLabel: string;
    score = 0;

    constructor() {
        console.log('score', this.score);
    }


    async ngOnInit() {
        // console.log('text', this.text);
        // this.score = await zxcvbn(this.text).score;
        // console.log('score', this.score);
    }

}
