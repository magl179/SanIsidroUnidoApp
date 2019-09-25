import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, IonSegment, PopoverController, ModalController } from "@ionic/angular";
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
// import { IUserLogued } from 'src/app/interfaces/barrios';
import { IBasicFilter, IRespuestaApiSIU, IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs/operators';
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { environment } from '../../../../environments/environment';
import { NetworkService } from 'src/app/services/network.service';
import { FilterPostsComponent } from "src/app/components/filter-posts/filter-posts.component";
import { FilterPage } from "../../../modals/filter/filter.page";
import { SearchPage } from 'src/app/modals/search/search.page';


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
        private networkService: NetworkService
    ) {
        console.log('Constructor Problemas Sociales');
    }

    async ngOnInit() {
        this.authService.getAuthUser().pipe(
            finalize(() => { })
        ).subscribe((res: any) => {
            this.AuthUser = res.user;
        },
            err => {
                console.log('Error al traer la informacion del usuario', err);
                this.utilsService.showToast('No se pudieron cargar la información del usuario');
            });
    }
    //Activar el Menu y Cargar los problemas sociales
    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.loadSocialProblems();
    }
    //Ir a la pagina para reportar problemas sociales
    reportSocialProblem() {
        this.navCtrl.navigateForward('/social-problem-create')
    }
    //Vaciar problemas sociales al salir pagina
    ionViewWillLeave() {
        console.log('IonWillLeave Listado Problemas Sociales Destruido');
        this.resetSocialProblems();
    }
    //Resetear los problemas sociales
    resetSocialProblems() {
        this.socialProblemsList = [];
        this.postsService.resetSocialProblemsPage();
    }
    //Verificar like en una publicacion
    // checkLikePost(details, auth_user): boolean {
    //     return this.utilsService.checkLikePost(details, auth_user);
    //     if ($details && $details.length > 0) {
    //         const likes_user = this.utilsService.getUsersFromDetails($details);
    //         const user_made_like = this.utilsService.checkUserInDetails(this.AuthUser.id, likes_user);
    //         return user_made_like;
    //     }
    //     else {
    //         return false;
    //     }
    // }
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
                // this.resetSocialProblems();
                // this.loadSocialProblems();
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
                // this.resetSocialProblems();
                // this.loadSocialProblems()
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
    loadSocialProblems(event?: any, resetEvents?: any) {
        this.socialProblemsLoaded = false;
        if (resetEvents) {
            this.postsService.resetSocialProblemsPage();
        }
        this.postsService.getSocialProblems().pipe(
            finalize(() => {
                this.socialProblemsLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let socialProblems = res.data.data;
            if (socialProblems) {
                socialProblems = socialProblems.map((social_problem: any) => {
                    // const postLiked = this.utilsService.checkLikePost(social_problem.details, this.AuthUser) || false;
                    social_problem.user.avatar = (social_problem.user && social_problem.user.avatar) ? this.getImageURL(social_problem.user.avatar) : null;
                    social_problem.postLiked = this.utilsService.checkLikePost(social_problem.details, this.AuthUser) || false;
                    return social_problem;
                });
                if (socialProblems.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.socialProblemsList.push(...socialProblems);
                //console.log('social_problems', this.socialProblems);
                this.socialProblemsFilter.push(...socialProblems);
                if (event) {
                    event.target.complete();
                }
            }
        },
            err => {
                console.log(err);
                this.utilsService.showToast('No se pudieron cargar los problemas sociales');
            });
    }
    //Obtener datos con el Infinite Scroll
    getInfiniteScrollData(event) {
        this.loadSocialProblems(event);
    }
    //Ir al detalle de un problema socialc
    postDetail(id) {
        this.resetSocialProblems();
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
    getImages($imagesArray) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }
    //Funcion mostrar el filtro de publicaciones
    async showFilterPosts(event) {
        //Crear Popover
        const popover = await this.popoverCtrl.create({
            component: FilterPostsComponent,
            event,
            backdropDismiss: false,
            showBackdrop: false,
            componentProps: {
                "posts": [...this.socialProblemsList],
                'subcategory': this.subcategory
            }
        });
        //Obtener datos popover cuando se vaya a cerrar
        popover.onDidDismiss().then((dataReturned: any) => {
            if (dataReturned !== null) {
                this.socialProblemsFilter = [...dataReturned.data.posts];
                this.subcategory = dataReturned.data.subcategory;
            }
        });
        //Presentar el Popover
        return await popover.present();
    }
    //Obtener Imagen 
    getImageURL(image_name: string) {
        const imgIsURL = this.utilsService.imgIsURL(image_name);
        return (imgIsURL) ? image_name : `${environment.apiBaseURL}/${environment.image_assets}/${image_name}`;
    }

    getBGCover(image_cover: any) {
        // console.log('has images', image_cover);
        const img = this.utilsService.getImageURL(image_cover);
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${img}')`;
    }

    async showSearchModal() {
        const modal = await this.modalCtrl.create({
            component: SearchPage,
            componentProps: {
                searchIdeas: [],
                originalSearchData: [...this.socialProblemsList],
                routeDetail: '/social-problem-detail',
                searchPlaceholder : 'Buscar Problemas Sociales',
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


    getHeaderBackData(event){
        if (event.wannaSearch) {
            this.showSearchModal();
        }
        if (event.wannaFilter) {
            this.showFilterModal();
        }
        if (event.wannaReport) {
            this.reportSocialProblem();
        }
    }


}
