import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-stepbar',
    templateUrl: './step-bar.component.html',
    styleUrls: ['./step-bar.component.scss'],
})
export class StepBarComponent implements OnInit {

    @Input() progressSteps: any;
    @Input() currentStep: any;
    @Output() retornarCurrentStep = new EventEmitter();

    // @Input() itemActive: number;

    constructor() { }

    ngOnInit() {
        // console.log({ps: this.progressSteps});
        // console.log({cs: this.currentStep});
    }
    
    getSizeOfObject(obj) {
        return Object.keys(obj).length || 0;
    }

    changeCurrentStep(currentStep) {
        // Usamos el método emit
        this.retornarCurrentStep.emit({
            currentStep: currentStep + 1
        });
    }

}
