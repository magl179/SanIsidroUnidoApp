import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISocialProblem, IPostShare } from 'src/app/interfaces/barrios';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    id: string;
    idPost: number;
    socialProblem: ISocialProblem = null;

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.idPost = Number(this.id);
        console.log('ID RECIBIDO:', this.id);
        setTimeout(() => {
            this.socialProblem = {
                id: 5,
                title: 'Problema',
                description: 'Descripcion del Problema',
                category_id: 5,
                user_id: 1,
                date: '2018-05-15',
                time: '18:00:25',
                ubication: null,
                likes: 11
            };
        }, 4000);
    }

    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image: 'no_image',
            url: ''

        };
        await this.utilsService.compartirRedSocial(sharePost);
    }

}
