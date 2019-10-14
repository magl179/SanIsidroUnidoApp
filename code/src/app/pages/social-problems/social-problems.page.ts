import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ModalController, ActionSheetController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { IBasicFilter, IRespuestaApiSIU, IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { UserService } from 'src/app/services/user.service';
import { finalize, map } from "rxjs/operators";
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { environment } from 'src/environments/environment';
import { FilterPage } from "src/app/modals/filter/filter.page";
import { SearchPage } from 'src/app/modals/search/search.page';
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem } from "../../helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "../../services/events.service";


@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems.page.html',
    styleUrls: ['./social-problems.page.scss'],
})
export class SocialProblemsPage implements OnInit {
    subcategory = '';
    AuthUser = null;

    socialProblemsList: ISocialProblem[] = [];
    socialProblemsFilter: ISocialProblem[] = [];
    socialProblemsLoaded = false;
    filters: IBasicFilter = {
        subcategory_id: {
            name: 'Subcategoria',
            value: "",
            type: 'select',
            options: [
                { id: 1, name: 'Transporte y Tránsito' },
                { id: 2, name: 'Seguridad' },
                { id: 3, name: 'Protección Animal' },
                { id: 4, name: 'Espacios Verdes' }
            ]
        },
        is_attended: {
            name: 'Estado',
            value: "",
            type: 'segment',
            options: [
                { id: 1, name: 'Atendidos' },
                { id: 0, name: 'Pendientes' }
            ]
        }
    };

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postsService: PostsService,
        private authService: AuthService,
        private userService: UserService,
        private modalCtrl: ModalController,
        private events_app: EventsService,
        private actionSheetCtrl: ActionSheetController
    ) {
    }

    ngOnInit() {
        this.utilsService.enableMenu();
        console.log('ng on init');
        this.authService.sessionAuthUser.pipe(
            finalize(() => { })
        ).subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        },
            err => {
                console.log('Error al traer la informacion del usuario', err);
                this.utilsService.showToast('No se pudieron cargar la información del usuario');
            });
        this.loadSocialProblems();
        this.events_app.getEventsApp().subscribe((event_app: any) => {
            if (event_app.type === 'like_problem_toggle') {
                this.loadSocialProblems(null, true, true);
            }
        });

    }

    ionViewWillEnter() { }
    //Ir a la pagina para reportar problemas sociales
    reportSocialProblem() {
        this.navCtrl.navigateForward('/social-problem-create')
    }
    //Eliminar o agregar like a una publicacion
    toggleLike(like: boolean, id: number) {
        if (like) {
            this.postsService.sendDeleteDetailToPost(id).subscribe((res: IRespuestaApiSIU) => {
                console.log('detalle eliminado correctamente');
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        social_problem.postLiked = false;
                    }
                });
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('No se pudo eliminar el like');
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postsService.sendCreateDetailToPost(detailInfo).subscribe((res: IRespuestaApiSIU) => {
                console.log('detalle creado correctamente');
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        social_problem.postLiked = true;
                    }
                });
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast('No se pudo dar like');
            });
        }
    }

    //Cargar los problemas sociales
    loadSocialProblems(event?: any, resetEventsPagination = false, resetData = false) {
        this.socialProblemsLoaded = false;
        if (resetData) {
            this.socialProblemsList = [];
            this.socialProblemsFilter = [];
        }
        if (resetEventsPagination) {
            this.postsService.resetSocialProblemsPage();
        }
        this.postsService.getSocialProblems().pipe(
            map((res: any) => {
                // console.log('res map', res);
                if (res && res.data && res.data.data) {
                    res.data.data.forEach((social_problem: any) => {
                        social_problem = mapSocialProblem(social_problem);
                    });
                }
                console.log('res maped', res.data.data);
                return res;
            }),
            finalize(() => {
                this.socialProblemsLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let socialProblems = [];
            socialProblems = res.data.data;
            // if (event && event.type === 'refresher') {
            //     socialProblems.unshift(...res.data.data);
            // } else {
            //     socialProblems.push(...res.data.data);
            // }
            

            if (socialProblems.length === 0) {
                if (event) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } else {
                socialProblems = socialProblems.map((social_problem: any) => {
                    social_problem.postLiked = checkLikePost(social_problem.details, this.AuthUser) || false;
                    return social_problem;
                });
            }
            if (event) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.socialProblemsList.unshift(...socialProblems);
                this.socialProblemsFilter.unshift(...socialProblems);
                return;
            }
            this.socialProblemsList.push(...socialProblems);
            this.socialProblemsFilter.push(...socialProblems);


        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }
    //Obtener datos con el Infinite Scroll
    getInfiniteScrollData(event: any) {
        this.loadSocialProblems({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: any) {
        this.loadSocialProblems({
            type: 'refresher',
            data: event
        });
    }
    //Ir al detalle de un problema socialc
    postDetail(id) {
        this.navCtrl.navigateForward(`/social-problem-detail/${id}`);
    }
    //Compartir el Problema Social
    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image: this.getImages(post.images),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }
    //Obtener las imagenes de un post
    getImages($imagesArray: any) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }
    //Funcion mostrar el filtro de publicaciones
    async showModalFilterSocialProblems(event) {
        //Crear Popover
        const modal = await this.modalCtrl.create({
            component: FilterPage,
            componentProps: {
                "data": [...this.socialProblemsList],
                'postTypeSlug': this.subcategory,
                'filters': this.filters
            }
        });
        //Obtener datos popover cuando se vaya a cerrar
        modal.onDidDismiss().then((modalReturn: any) => {
            console.log('modal returned', modalReturn);
            // if (modal.data) {
            //     this.socialProblemsFilter = [...modal.data.posts];
            //     this.subcategory = modal.data.subcategory;
            // }
            if (modalReturn.data && modalReturn.data.data && modalReturn.data.filters) {
                this.socialProblemsFilter = [...modalReturn.data.data];
                this.subcategory = modalReturn.data.subcategory;
                this.filters = modalReturn.data.filters;
            }
            console.log('Data Returned Modal Filter', modalReturn.data);
        });
        //Presentar el Popover
        return await modal.present();
    }

    async showModalSearchSocialProblems() {
        const modal = await this.modalCtrl.create({
            component: SearchPage,
            componentProps: {
                searchIdeas: [],
                originalSearchData: [...this.socialProblemsList],
                routeDetail: '/social-problem-detail',
                searchPlaceholder: 'Buscar Problemas Sociales',
                fieldsToSearch: ['title', 'description'],
                searchInApi: true,
                postTypeSlug: environment.socialProblemSlug
            }
        });
        //Obtener datos popover cuando se vaya a cerrar
        // modal.onDidDismiss().then((dataReturned: any) => {
        // });
        await modal.present();
    }
  
}
