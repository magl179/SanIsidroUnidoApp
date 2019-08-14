import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISocialProblem, IPostShare } from 'src/app/interfaces/barrios';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from '../../../services/posts.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    id: string;
    idPost: number;
    socialProblem: ISocialProblem = null;
    userPost = null;

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private userService: UserService) { }

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        // this.idPost = Number(this.id);
        await this.postService.getSocialProblem(+this.id).subscribe(res => {
            this.socialProblem = res.data;
            console.log('res post', res);
            console.log('Dato post', this.socialProblem);
            this.getUserPostInfo();
            // (() => {
            // });
        });
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

    getUserPostInfo() {
        this.userService.getUserInfo(this.socialProblem.user_id).subscribe((res: any )=> {
            this.userPost = res.data;
            console.log('userPost', this.userPost);
        }, err =>{
                console.log(err);
        })
    }

}
