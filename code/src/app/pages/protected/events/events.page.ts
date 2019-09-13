import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { IEvent, IPostShare } from 'src/app/interfaces/models';
import { PostsService } from '../../../services/posts.service';
import { AuthService } from '../../../services/auth.service';
import { NetworkService } from '../../../services/network.service';
import { environment } from "../../../../environments/environment";
import { finalize } from 'rxjs/operators';
@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    // appNetworkConnection = false;
    // loading: any;
    ideas = ['Spiderman', 'Batman', 'Lolita', 'Calderon', 'Transporte'];
    
    searchingEvents = false;
    eventsBusqueda = [];
    eventsList: IEvent[] = [];
    textoEventoBuscar = '';

    elements: any = [];
    AuthUser = null;

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService,
        private networkService: NetworkService
    ) { 
        console.log('Constructor Eventos');
    }


    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }

    ngOnInit() {
        // this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
        //     this.appNetworkConnection = connected;
        // });
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user; 
        });
    }
    
    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.loadEvents();
    }

    // checkLikePost($details) {
    //     if ($details && $details.length > 0) {
    //         const likes_user = this.utilsService.getUsersFromDetails($details);
    //         const user_made_like = this.utilsService.checkUserInDetails(this.AuthUser.id, likes_user);
    //         // console.log('likes user', likes_user);
    //         // console.log('user made like', user_made_like);
    //         // console.log('user authenticated id', this.AuthUser.id);
    //         return user_made_like;
    //     }
    //     else {
    //         // console.log('no paso tamanio details');
    //         return false;
    //     }
    // }

    toggleAssistance(assistance: boolean, id: number) {
        // console.log((assistance) ? 'quitar assistencia' : 'dar asistencia');
        if (assistance) {
            this.postService.sendDeleteDetailToPost(id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.resetEvents();
                this.loadEvents();
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('La asistencia no pudo ser eliminada');
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
                    this.utilsService.showToast('No se pudo eliminar la asistencia');
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

    resetEvents() {
        this.eventsList = [];
        this.postService.resetEventsPage();
    }

    searchEvents(event) {
        const valor: string = event.detail.value;
        if (valor.length === 0) {
            this.searchingEvents = false;
            this.eventsBusqueda = [];
            return;
        }
        this.searchingEvents = true;
        this.postService.searchPosts(valor, environment.eventsSlug).pipe(
            finalize(() => {
                this.searchingEvents = false;
            })
        ).subscribe((res: any) => {
            console.log('events search', res);
            this.eventsBusqueda = res.data;
            if (res.data.length === 0) {
                this.utilsService.showToast('No hay coincidencias');
            } else {
                this.utilsService.showToast(`Hay ${res.data.length} coincidencias`);
            }
        }, err => {
                console.log('Ocurrio un error al buscar eventos', err);
                this.utilsService.showToast('Ocurrio un error al buscar eventos');
        });
    }

    loadEvents(event?, resetEvents?) {
        this.postService.getEvents().subscribe(res => {
            let events = res.data.data;
            if (events) {
                console.log('data', res);
                events = events.map((event: any) => {
                    const postLiked = this.utilsService.checkLikePost(event.details, this.AuthUser) || false;
                    event.postLiked = postLiked;
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

    ionViewWillLeave() {
        this.resetEvents();
    }
    
    postDetail(id) {
        this.resetEvents();
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }

    getInfiniteScrollData(event) {
            this.loadEvents(event);
    }


}
