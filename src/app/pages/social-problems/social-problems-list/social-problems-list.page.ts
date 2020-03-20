import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { IBasicFilter, IRespuestaApiSIU, IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { finalize, map } from "rxjs/operators";
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { environment } from 'src/environments/environment';
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem, setFilterKeys, filterDataInObject } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { NavigationService } from 'src/app/services/navigation.service';
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from 'src/app/services/messages.service';


@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems-list.page.html',
    styleUrls: ['./social-problems-list.page.scss'],
})
export class SocialProblemsListPage implements OnInit, OnDestroy {

    showLoading = true;
    showNotFound = false;
    subcategory: string;
    AuthUser = null;
    slugSubcategory: string = '';
    filtersToApply: any = { is_attended: ""};
    socialProblemsList: ISocialProblem[] = [];
    socialProblemsFilter: ISocialProblem[] = [];
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
        private router: Router,
        private errorService: ErrorService,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private messageService: MessagesService,
        private postsService: PostsService,
        private authService: AuthService,
        private events_app: EventsService,
    ) {
        
    }

    ngOnInit() {
        this.subcategory = this.activatedRoute.snapshot.paramMap.get('subcategory');
        this.postsService.resetSocialProblemsPage();
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.pipe(
            finalize(() => { })
        ).subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        },(err: any) => {;
            this.errorService.manageHttpError(err, 'No se pudo cargar la información del usuario');
        });
        this.loadSocialProblems(null, true);
        this.events_app.socialProblemLikesEmitter.subscribe((event_app: any) => {
            console.warn('RESET LIKES ID', event_app.id);
            this.toggleLikes(event_app.id, event_app.reactions);
        });
    }

    redirectToSearch(){
        this.navCtrl.navigateRoot("/social-problems/search", {
            queryParams: { redirectUrl: this.router.url }
        });
    }

    toggleLikes(id: number, reactions = []) {
        const newSocialProblems = this.socialProblemsList.map((social_problem: any) => {
            social_problem.postLiked = checkLikePost(reactions, this.AuthUser) || false;
            return social_problem;
        });
        // socialProblems = socialProblems.map((social_problem: any) => {
        //     social_problem.postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
        //     return social_problem;
        // });
        this.socialProblemsList = [...newSocialProblems];
        this.socialProblemsFilter = [...this.socialProblemsList];
    }

    ngOnDestroy() {}
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetSocialProblemsBySubcategoryPage(); }
    //Eliminar o agregar like a una publicacion
    toggleLike(like: boolean, id: number) {
        if (like) {
            this.postsService.sendDeleteDetailToPost(id).subscribe((res: any) => {
                this.socialProblemsList.forEach(social_problem => {                   
                    if (social_problem.id === id) {
                        if(res.data.reactions){
                            social_problem.postLiked = false;
                            social_problem.reactions = res.data.reactions;
                        }
                    }
                });
            }, (err: any) => {
                this.errorService.manageHttpError(err, 'El me gusta no pudo ser borrado');
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postsService.sendCreateDetailToPost(detailInfo).subscribe((res: any) => {
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        if(res.data.reactions){
                            social_problem.postLiked = true;
                            social_problem.reactions = res.data.reactions;
                        }
                    }
                });
            }, (err: any) => {
                this.errorService.manageHttpError(err, 'El me gusta no pudo ser guardado');
            });
        }
    }

    //Cargar los problemas sociales
    loadSocialProblems(event: any = null, first_loading=false) {
        this.postsService.getPostsBySubCategory(CONFIG.SOCIAL_PROBLEMS_SLUG, this.subcategory).pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    res.data.forEach((social_problem: any) => {
                        social_problem = mapSocialProblem(social_problem);
                    });
                }
                return res;
            }),
            finalize(() => {
                if(first_loading){
                    this.showLoading = false;
                }
                if(first_loading && this.socialProblemsList.length === 0){
                    this.showNotFound = true;
                } 
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let socialProblems = [];
            socialProblems = res.data;

            if (socialProblems.length === 0) {
                if (event && event.data && event.data.target && event.data.target.complete) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } else {
                socialProblems = socialProblems.map((social_problem: any) => {
                    social_problem.postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
                    return social_problem;
                });
            }
            if (event && event.data && event.data.target && event.data.target.complete) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.socialProblemsList.unshift(...socialProblems);
                this.socialProblemsFilter.unshift(...socialProblems);
                return;
            }else if(event && event.type == 'infinite_scroll'){
                this.socialProblemsList.push(...socialProblems);
                this.socialProblemsFilter.push(...socialProblems);
            }else{
                this.socialProblemsList.push(...socialProblems);
                this.socialProblemsFilter.push(...socialProblems);
            }
        }, (err: HttpErrorResponse) => {
            this.errorService.manageHttpError(err, 'Ocurrio un error al cargar el listado de problemas sociales');
        });
    }
    //Obtener datos con el Infinite Scroll
    doInfiniteScroll(event: any) {
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
    postDetail(id: any) {
        this.navCtrl.navigateForward(`/social-problems/list/${this.subcategory}/${id}`);
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
    //Filtrar por Estado Atención
    segmentChanged(event: any) {
        const value = (event.detail.value !== "") ? Number(event.detail.value) : "";
        const type = 'is_attended';
        if (value !== "") {
            const filterApplied = setFilterKeys({...this.filtersToApply}, type, value);
            this.filtersToApply = filterApplied;
            this.socialProblemsFilter = filterDataInObject([...this.socialProblemsList], {...this.filtersToApply});
        } else {
            this.socialProblemsFilter = this.socialProblemsList;
        }
    }

}
