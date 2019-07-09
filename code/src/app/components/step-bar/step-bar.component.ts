import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-stepbar',
    templateUrl: './step-bar.component.html',
    styleUrls: ['./step-bar.component.scss'],
})
export class StepBarComponent implements OnInit {

    @Input() progressSteps: any;
    @Input() currentStep = 1;
    @Output() returnCurrentStep = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    getSizeOfObject(obj) {
        return Object.keys(obj).length || 0;
    }

    changeCurrentStep(currentStep) {
        // Usamos el método emit
        this.returnCurrentStep.emit({
            currentStep: currentStep + 1
        });
    }

}
