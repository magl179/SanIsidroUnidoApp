import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { IEvent, IPostShare } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

    loading: any;
    elements: any = [];
    AuthUser = null;
    eventsList: IEvent[] = [];

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService
    ) { }


    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }

    ngOnInit() {
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user; 
        });
        this.loadEvents();
    }

    checkLikePost($details) {
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

    toggleAssistance(assistance: boolean, id: number) {
        console.log((assistance) ? 'quitar assistencia' : 'dar asistencia');
        if (assistance) {
            this.postService.sendDeleteDetailToPost(id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.resetEvents();
                this.loadEvents();
            }, err => {
                    console.log('detalle no se pudo eliminar', err);
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id : id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                this.resetEvents();
                this.loadEvents();
            }, err => {
                    console.log('detalle no se pudo crear', err);
            });
        }
    }

    async sharePost(post: IEvent) {
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

    resetEvents() {
        this.eventsList = [];
        this.postService.resetEventsPage();
    }

    ngOnDestroy() {
        this.resetEvents();
    }

    loadEvents(event?, resetEvents?) {
        // if (resetEvents) {
        //     this.postService.resetEventsPage();
        // }
        this.postService.getEvents().subscribe(res => {
            if (res.data) {
                console.log('data', res);
                if (res.data.data.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.eventsList.push(...res.data.data);
                if (event) {
                    event.target.complete();
                }
            }
        },
        err => {
            console.log(err);
        });
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }
    postDetail(id) {
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }

    getInfiniteScrollData(event) {
            this.loadEvents(event);
    }


}
