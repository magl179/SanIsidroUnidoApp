import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';

import { ISimpleUbicationItem } from 'src/app/interfaces/barrios';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
import { IEvent, IPostShare } from '../../../interfaces/models';
import { NetworkService } from '../../../services/network.service';
import { environment } from 'src/environments/environment.prod';
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from "../../../modals/image_detail/image_detail.page";
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    id: string;
    eventLoaded = false;
    appNetworkConnection = false;
    AuthUser = null;
    event:IEvent = null;

    // mapPoints: ISimpleUbicationItem = {
    //     latitude: 0.0456696,
    //     longitude: -78.14502999999999,
    //     title: 'Ubicación del Evento'
    // };

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private modalCtrl: ModalController,
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
        this.eventLoaded = false;
        this.postService.getEvent(+this.id).pipe(
            finalize(() => {
                this.eventLoaded = true;
            })
        ).subscribe(res => {
            if (res) {
                this.event = res.data;
                if (this.event) {
                    this.event.postAssistance = this.utilsService.checkLikePost(this.event.details, this.AuthUser);
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
                // this.getEvent();
                this.event.postAssistance = false;
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
                // this.getEvent();
                this.event.postAssistance = true;
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

    //Obtener Imagen 
    getImageURL(image_name: string) {
        const imgIsURL = this.utilsService.imgIsURL(image_name);
        return (imgIsURL) ? image_name : `${environment.apiBaseURL}/${environment.image_assets}/${image_name}` ;
    }

    getBGCover(image_cover: any) {
        // console.log('has images', image_cover);
        const img = this.utilsService.getImageURL(image_cover);
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${img}')`;
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

    async showImageDetailModal(image: string) {
        const modal = await this.modalCtrl.create({
            component: ImageDetailPage,
            componentProps: {
                image,
            }
        });
        await modal.present();
    }

}
// 