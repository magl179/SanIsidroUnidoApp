import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { NavController, IonSearchbar } from '@ionic/angular';
import { finalize, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ITokenDecoded } from 'src/app/interfaces/models';
import { IPost } from 'src/app/interfaces/models';
import { ErrorService } from '../../../services/error.service';
import { setInputFocus } from '../../../helpers/utils';

@Component({
    selector: 'app-search-posts',
    templateUrl: './search-posts.page.html',
    styleUrls: ['./search-posts.page.scss'],
})
export class SearchPostsPage implements OnInit {

    @ViewChild('searchPostBar') searchPostBar: IonSearchbar;
    searchIdeas: string[] = [];
    searchPlaceholder = '';
    searchSlug = '';
    searchRouteDetail = '';


    itemsSearchFound: IPost[] = [];
    searchingPosts = false;
    resultsNotFound = false;
    valueToSearch = new BehaviorSubject('');
    requestStatus = '';
    includeUserFilter = false;
    redirectWith = 'id';
    AuthUser: ITokenDecoded = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private postsService: PostsService,
        private navCtrl: NavController,
        private errorService: ErrorService,
    ) {
    }

    seeDetailItemFound(category: string, subcategory: string, id: number) {
        let urlRedirect = '';
        switch (this.redirectWith) {
            case 'category+subcategory+id':
                urlRedirect = `${this.searchRouteDetail}/${category}/${subcategory}/${id}`;
                break;
            case 'subcategory+id':
                urlRedirect = `${this.searchRouteDetail}/${subcategory}/${id}`;
                break;
            default:
                urlRedirect = `${this.searchRouteDetail}/${id}`;//id
                break;
        }
        this.navCtrl.navigateForward(urlRedirect);

    }

    setSuggessValue(idea: string) {
        this.searchPostBar.setFocus();
        this.valueToSearch.next(idea);
        console.log('this.searchPostBar', this.searchPostBar);
        this.searchingPosts = true;
    }

    getValueObservable() {
        return this.valueToSearch.asObservable();
    }

    execSearchPosts(event: any) {
        this.valueToSearch.next(event.detail.value);
    }

    setInitialValues() {
        const routeData = this.activatedRoute.snapshot.data;
        this.searchIdeas = (routeData.searchIdeas) ? routeData.searchIdeas : ['ferguson', 'Manual', 'Byron', 'Calderon', 'Lolita'];
        this.searchPlaceholder = (routeData.searchPlaceholder) ? routeData.searchPlaceholder : 'Buscar Publicaciones';
        this.searchSlug = (routeData.searchSlug) ? routeData.searchSlug : '';
        this.searchRouteDetail = (routeData.searchRouteDetail) ? routeData.searchRouteDetail : '';
        this.includeUserFilter = (routeData.includeUserFilter) ? (routeData.includeUserFilter) : false;
        this.redirectWith = (routeData.redirectWith) ? (routeData.redirectWith) : false;
        this.searchIdeas = ['j'];
    }

    ngOnInit() {

        this.setInitialValues();
        this.authService.sessionAuthUser.subscribe(async (token_decoded: ITokenDecoded) => {
            if (token_decoded) {
                this.AuthUser = token_decoded;
            }
        });

        this.getValueObservable().pipe(
            map(search_term => search_term),
            debounceTime(1000),
            distinctUntilChanged(),
            finalize(() => {
                this.searchingPosts = false;
            }),
        ).subscribe(async (value: any) => {
            this.searchingPosts = true;
            if (value.length === 0) {
                this.searchingPosts = false;
                this.itemsSearchFound = [];
                return;
            }
            //Agregar palabra a array sugerencias
            if (this.searchIdeas.indexOf(value) === -1) {
                // array.push(item)
                this.searchIdeas.push(value);
            };

            this.searchingPosts = true;
            this.requestStatus = '';
            let searchParams = {};
            if (this.includeUserFilter) {
                searchParams = {
                    'filter[category]': this.searchSlug,
                    'filter[user]': this.AuthUser.user.id,
                    'filter[title]': value
                }
            } else {
                searchParams = {
                    'filter[category]': this.searchSlug,
                    'filter[title]': value
                }
            }
            this.postsService.searchPosts(searchParams).pipe(
                finalize(() => {
                    this.searchingPosts = false;
                })
            ).subscribe((res: any) => {
                this.itemsSearchFound = res.data;
                this.requestStatus = 'success';
                if (res.data.length === 0) {
                    this.resultsNotFound = true;
                } else {
                    this.resultsNotFound = false;
                }
            }, (err: HttpErrorResponse) => {
                this.itemsSearchFound = [];
                this.requestStatus = 'fails';
                this.errorService.manageHttpError(err, 'Ocurrio un error al realizar la búsqueda');
            });

        });
    }

}
