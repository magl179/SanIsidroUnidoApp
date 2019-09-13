import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

import { ISimpleUbicationItem } from 'src/app/interfaces/barrios';
import { IEventDetail } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
import { IEvent, IPostShare } from '../../../interfaces/models';
import { NetworkService } from '../../../services/network.service';


@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    id: string;
    postLiked = false;
    appNetworkConnection = false;
    AuthUser = null;
    event:IEventDetail = null;

    mapPoints: ISimpleUbicationItem = {
        latitude: 0.0456696,
        longitude: -78.14502999999999,
        title: 'Ubicación del Evento'
    };

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private networkService: NetworkService,
        private authService: AuthService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        console.log('ID RECIBIDO:', this.id);
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user; 
        });
        this.getEvent();
    }

    getEvent() {
        this.postService.getEvent(+this.id).subscribe(res => {
            if (res) {
                this.event = res.data;
                if (this.event) {
                    this.postLiked = this.utilsService.checkLikePost(this.event.details, this.AuthUser);
                }
                // console.log('res post', res);
                // console.log('Dato post', this.event);
            }
            
        });
    }

    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }

    test() {
        this.utilsService.showToast();
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

    toggleAssistance(assistance: boolean) {
        console.log((assistance) ? 'quitar assistencia' : 'dar asistencia');
        if (assistance) {
            this.postService.sendDeleteDetailToPost(this.event.id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.getEvent();
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('La asistencia no ha podido ser eliminada');
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id : this.event.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                this.getEvent();
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast('No se pudo guardar la asistencia');
            });
        }
    }

    async sharePost(post: IEvent) {
        const sharePost: IPostShare  = {
            title: post.title,
            description: post.description,
            image:  this.getImages(post.images),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }

    getImages($imagesArray) {
        if ($imagesArray) {
            if ($imagesArray.length === 0) {
                return '';
            } else {
                return $imagesArray[0].url;
            }
        } else {
            return '';
        }
       
    }

}
