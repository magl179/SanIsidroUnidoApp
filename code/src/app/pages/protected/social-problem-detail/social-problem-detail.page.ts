import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ISocialProblem } from 'src/app/interfaces/barrios';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from '../../../services/posts.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { IPostShare, ISocialProblem } from '../../../interfaces/models';

@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    id: string;
    idPost: number;
    socialProblem: ISocialProblem = null;
    AuthUser = null;

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private userService: UserService,
        private authService: AuthService) { }

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        // this.idPost = Number(this.id);
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user;
        },
        err => {
            console.log('Error al traer los problemas sociales');    
            });
        this.getSocialProblem();
        // await this.postService.getSocialProblem(+this.id).subscribe(res => {
        //     this.socialProblem = res.data;
        //     console.log('res post', res);
        //     console.log('Dato post', this.socialProblem);
        //     // this.getUserPostInfo();
        //     // (() => {
        //     // });
        // });
    }

    getSocialProblem() {
        this.postService.getSocialProblem(+this.id).subscribe(res => {
            this.socialProblem = res.data;
            console.log('res post', res);
            console.log('Dato post', this.socialProblem);
        });
    }

    checkLikePost($details) {
        // console.log('origen: ', kk);
        if ($details && $details.length > 0) {
            const likes_user = this.utilsService.getUsersFromDetails($details);
            const user_made_like = this.utilsService.checkUserInDetails(this.AuthUser.id, likes_user);
            // console.log('likes user', likes_user);
            // console.log('user made like', user_made_like);
            // console.log('user authenticated id', this.AuthUser.id);
            return user_made_like;
        }
        else {
            // console.log('no paso tamanio details');
            return false;
        }
    }

    toggleLike(like: boolean) {
        console.log((like) ? 'quitar like' : 'dar like');
        if (like) {
            this.postService.sendDeleteDetailToPost(this.socialProblem.id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.getSocialProblem();
            }, err => {
                    console.log('detalle no se pudo eliminar', err);
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id : this.socialProblem.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                this.getSocialProblem();
            }, err => {
                    console.log('detalle no se pudo crear', err);
            });
        }
    }

    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image:  this.getImages(post.images),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }

    getImages($imagesArray) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }

    // getUserPostInfo() {
    //     this.userService.getUserInfo(this.socialProblem.user_id).subscribe((res: any )=> {
    //         this.userPost = res.data;
    //         console.log('userPost', this.userPost);
    //     }, err =>{
    //             console.log(err);
    //     })
    // }

}
