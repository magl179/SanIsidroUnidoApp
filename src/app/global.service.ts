import { Injectable, OnInit } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class GlobalService implements OnInit {

    private socialProblems = [];

    constructor(
       
    ) {
      
    }

    ngOnInit(){

    }

    public getSocialProblems(){
        return [...this.socialProblems];
    }
    public setSocialProblem(any){
        const tempArr = [...this.socialProblems];
        tempArr.push(any);
        this.socialProblems = [...tempArr];

    }
    
    public setSocialProblems(newSocialProblems: any[]){
        this.socialProblems = [...newSocialProblems];
    }
}