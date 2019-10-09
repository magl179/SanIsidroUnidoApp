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
        private popoverCtrl: PopoverController,
        private actionSheetCtrl: ActionSheetController
    ) {
    }

    async ngOnInit() {
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
        this.loadSocialProblems(null, true);
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

    async showActionCtrl(socialProblem: ISocialProblem) {
        const actionShare = {
            text: 'Compartir',
            icon: 'share',
            cssClass: ['share-event'],
            handler: () => {
                console.log('compartir evento', event);
                this.sharePost(socialProblem);
            }
        }
        const actionToggleLike = {
            text: 'Me gusta',
            icon: 'heart',
            cssClass: ['toggle-like', (socialProblem.postLiked) ? 'active' : ''],
            handler: () => {
                console.log('like toggle');
                this.toggleLike(socialProblem.postLiked, socialProblem.id);
            }
        }

        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                actionShare,
                actionToggleLike, {
                    text: 'Cancelar',
                    icon: 'close',
                    cssClass: ['cancel-action'],
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await actionSheet.present();
    }

    //Cargar los problemas sociales
    loadSocialProblems(event?: any, resetEvents?: any) {
        this.socialProblemsLoaded = false;
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
            socialProblems.push(...res.data.data);

            if (socialProblems.length === 0) {
                if (event) {
                    event.target.disabled = true;
                    event.target.complete();
                }
                return;
            } else {
                socialProblems = socialProblems.map((social_problem: any) => {
                    social_problem.postLiked = checkLikePost(social_problem.details, this.AuthUser) || false;
                    return social_problem;
                });
            }
            this.socialProblemsList.push(...socialProblems);
            this.socialProblemsFilter.push(...socialProblems);
            if (event) {
                event.target.complete();
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }
    //Obtener datos con el Infinite Scroll
    getInfiniteScrollData(event) {
        this.loadSocialProblems(event);
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
        modal.onDidDismiss().then((modal: any) => {
            console.log('modal returned', modal);
            if (modal.data) {
                this.socialProblemsFilter = [...modal.data.posts];
                this.subcategory = modal.data.subcategory;
            }
        });
        //Presentar el Popover
        return await modal.present();
    }

    getBGCover(image_cover: any) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
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
        modal.onDidDismiss().then((dataReturned: any) => {
            // if (dataReturned !== null) {
            //     this.socialProblemsFilter = [...dataReturned.data.data];
            //     this.filters = dataReturned.data.filters;
            //     // this.subcategory = dataReturned.data.subcategory;
            // }
        });
        await modal.present();
    }
    async showFilterModal() {

        const modal = await this.modalCtrl.create({
            component: FilterPage,
            componentProps: {
                data: [...this.socialProblemsList],
                filters: this.filters,
                // filterInApi: true,
                // postTypeSlug: environment.socialProblemSlug
            }
        });
        //Obtener datos popover cuando se vaya a cerrar
        modal.onDidDismiss().then((modalReturn: any) => {
            if (modalReturn.data && modalReturn.data.data && modalReturn.data.filters) {
                this.socialProblemsFilter = [...modalReturn.data.data];
                this.filters = modalReturn.data.filters;
                // this.subcategory = dataReturned.data.subcategory;
            }
        });
        await modal.present();
    }


    // getHeaderBackData(event){
    //     if (event.wannaSearch) {
    //         this.showSearchModal();
    //     }
    //     if (event.wannaFilter) {
    //         this.showFilterModal();
    //     }
    //     if (event.wannaReport) {
    //         this.reportSocialProblem();
    //     }
    // }


}
