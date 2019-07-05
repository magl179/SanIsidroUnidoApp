import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-social-problem-detail',
  templateUrl: './social-problem-detail.page.html',
  styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    id: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('ID RECIBIDO:', this.id);
  }

}
