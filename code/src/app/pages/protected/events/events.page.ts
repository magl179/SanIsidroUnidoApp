import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController } from "@ionic/angular";
import { UtilsService } from '../../../services/utils.service';
import { IPostShare } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
import { NetworkService } from '../../../services/network.service';
import { environment } from "../../../../environments/environment";
import { finalize } from 'rxjs/operators';
import { SearchPage } from "../../../modals/search/search.page";
import { IEvent } from "../../../interfaces/models";
// import { CacheService, Cache } from 'ionic-cache-observable';
@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    // appNetworkConnection = false;
    // private cacheEvents: Cache<any>;
    eventsLoaded = false;
    eventsList: IEvent[] = [];
    AuthUser = null;

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService,
        private modalCtrl: ModalController
    ) {
        console.log('Constructor Eventos');
    }


    getFullDate(date: string, time: string) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }

    ngOnInit() {
        this.authService.getAuthUser().subscribe(token_decoded => {
            if (token_decoded.user) {
                this.AuthUser = token_decoded.user; 
            }
        });
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.loadEvents();
    }

    toggleAssistance(assistance: boolean, id: number) {
        if (assistance) {
            this.postService.sendDeleteDetailToPost(id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        event.postAssistance = false;
                    }
                });
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('La asistencia no pudo ser eliminada');
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        event.postAssistance = true;
                    }
                });
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast('No se pudo eliminar la asistencia');
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

    getImages($imagesArray: any[]) {
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

    async showModalSearchEvents() {
        const modal = await this.modalCtrl.create({
            component: SearchPage,
            componentProps: {
                searchPlaceholder: 'Buscar Eventos',
                searchIdeas: [],
                originalSearchData: this.eventsList,
                routeDetail: '/event-detail',
                fieldsToSearch: ['title', 'description'],
                searchInApi: true,
                postTypeSlug: environment.eventsSlug
            }
        });
        await modal.present();
    }

    resetEvents() {
        this.eventsList = [];
        this.postService.resetEventsPage();
    }

    getImageCover(event: IEvent) {
        if (event.images && event.images.length > 0) {
            return this.getBGCover(event.images[0].url);
        } else {
            return '';
        }
    }

    loadEvents(event?: any, resetEvents?: any) {
        this.eventsLoaded = false;
        if (resetEvents) {
            this.resetEvents()
        }
        this.postService.getEvents().pipe(
            finalize(() => {
                this.eventsLoaded = true;
                console.log('finalize get events', this.eventsLoaded);
                console.log('finalize get events', this.eventsList);
            })
        ).subscribe(res => {
            let events = res.data.data;
            if (events) {
                console.log('data', res);
                events = events.map((event: any) => {
                    const postAssistance = this.utilsService.checkLikePost(event.details, this.AuthUser) || false;
                    event.postAssistance = postAssistance;
                    if (event.images && event.images.length > 0) {
                        event.images = this.utilsService.mapImagesApi(event.images);
                    }
                    return event;
                });
                if (events.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.eventsList.push(...events);
                if (event) {
                    event.target.complete();
                }
            }
        },
            err => {
                console.log(err);
                this.utilsService.showToast('No se pudieron cargar los eventos');
            });
    }

    postDetail(id) {
        this.resetEvents();
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }

    getInfiniteScrollData(event) {
        this.loadEvents(event);
    }

    getBGCover(image_cover: any) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
    }






}
