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
    event: IEvent = null;

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
        this.authService.getAuthUser().subscribe(token_decoded => {
            if (token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.getEvent();
    }

    getEvent(event?: any, resetEvents?: any) {
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
                    if (this.event.images && this.event.images.length > 0) {
                        this.event.images = this.utilsService.mapImagesApi(this.event.images);
                    }
                }
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
            return user_made_like;
        }
        else {
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
                post_id: this.event.id
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
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image: this.getImages(post.images),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }

    getBGCover(image_cover: any) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
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
        // if
    }

    seeImageDetail(image: string) {
        console.log('see image', image)
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

}
//