import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { NavController } from '@ionic/angular';
import { finalize, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ITokenDecoded } from 'src/app/interfaces/models';
import { IPost } from '../../interfaces/models';

@Component({
    selector: 'app-search-posts',
    templateUrl: './search-posts.page.html',
    styleUrls: ['./search-posts.page.scss'],
})
export class SearchPostsPage implements OnInit {

    searchIdeas: string[] = [];
    searchPlaceholder = '';
    searchSlug = '';
    searchRouteDetail = '';

    itemsSearchFound: IPost[] = [];
    searchingPosts = false;
    valueToSearch = new BehaviorSubject('');
    requestStatus = '';
    includeUserFilter = false;
    redirectWith = 'id';
    AuthUser: ITokenDecoded = null;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private postsService: PostsService,
        private navCtrl: NavController
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
        console.log('redirectWith', this.redirectWith);
        console.log('urlRedirect', urlRedirect);
        this.navCtrl.navigateForward(urlRedirect);

    }

    setSuggessValue(idea: string) {
        this.valueToSearch.next(idea);
    }

    getValueObservable() {
        return this.valueToSearch.asObservable();
    }

    execSearchPosts(event: any) {
        console.log('event search', event);
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
        console.log('params', this.searchSlug);

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
            console.log('value', value);
            this.searchingPosts = true;
            if (value.length === 0) {
                this.searchingPosts = false;
                console.log('No buscar valor vacio');
                this.itemsSearchFound = [];
                return;
            }

            this.searchingPosts = true;
            this.requestStatus = '';
            let searchParams = {};
            console.log('includeUserFilter', this.includeUserFilter);
            if (this.includeUserFilter) {
                searchParams = {
                    'filter[category]': this.searchSlug,
                    'filter[user]': this.AuthUser.user.id,
                    'filter[title]': value
                }
            } else {
                console.log('include user filter');
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
                console.log('events search', res);
                this.itemsSearchFound = res.data;
                this.requestStatus = 'success';
                if (res.data.length === 0) {
                    console.log('No hay coincidencias');
                } else {
                    console.log(`Hay ${this.itemsSearchFound.length} coincidencias`);
                }
            }, (err: HttpErrorResponse) => {
                this.itemsSearchFound = [];
                this.requestStatus = 'fails';
                if (err.error instanceof Error) {
                    console.log("Client-side error", err);
                } else {
                    console.log("Server-side error", err);
                }
            });

        });
    }

}
