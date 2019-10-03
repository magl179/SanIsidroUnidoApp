import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from '@ionic/angular';
import { IBasicFilter } from 'src/app/interfaces/models';
import { PostsService } from "src/app/services/posts.service";
import { finalize } from 'rxjs/operators';




@Component({
    selector: 'modal-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

    @Input() data2: any = [
        { id: 1, name: 'lr1', subcategory_id: 1, state: 0 },
        { id: 2, name: 'lr2', subcategory_id: 2, state: 1 },
        { id: 3, name: 'lr3', subcategory_id: 3, state: 0 },
        { id: 4, name: 'lr4', subcategory_id: 4, state: 1 },
        { id: 5, name: 'lr5', subcategory_id: 4, state: 1 },
        { id: 6, name: 'lr6', subcategory_id: 1, state: 0 },
        { id: 7, name: 'lr7', subcategory_id: 2, state: 1 },
        { id: 8, name: 'lr8', subcategory_id: 3, state: 0 },
        { id: 9, name: 'lr9', subcategory_id: 3, state: 1 },
        { id: 10, name: 'lr10', subcategory_id: 4, state: 0 }
    ];


    @Input() filters2: IBasicFilter = {
        subcategory_id: {
            name: 'Subcategoria',
            value: "",
            options: [
                { id: 1, name: 'Transporte y Tránsito' },
                { id: 2, name: 'Seguridad' },
                { id: 3, name: 'Protección Animal' },
                { id: 4, name: 'Espacios Verdes' }
            ]
        },
        state: {
            name: 'Estado',
            value: "",
            options: [
                { id: 1, name: 'Atendidos' },
                { id: 0, name: 'Pendientes' }
            ]
        }
    };

    data: any;
    filteringPosts = false;
    allDataPlaceholder: string;
    filters: any;
    dataFiltered: any = [];
    filtersToApply: any = {};
    filterInApi = false;
    postTypeSlug = null;

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private postsService: PostsService
    ) {
        this.allDataPlaceholder = (this.navParams.data.allDataPlaceholder)?this.navParams.data.allDataPlaceholder: 'Todas';
        // console.table(this.navParams);
        this.data = this.navParams.data.data;        
        this.filters = this.navParams.data.filters;
        this.dataFiltered.push(...this.data);
        this.filterInApi = (this.navParams.data.filterInApi) ? this.navParams.data.filterInApi : false;
        this.postTypeSlug = (this.navParams.data.postTypeSlug) ? this.navParams.data.postTypeSlug : null;
    }

    ngOnInit() {
    }

    closeModal() {
        this.modalCtrl.dismiss({
            'data': this.dataFiltered,
            'filters': this.filters
        });
        console.log('filters to return', this.filters);
    }

    closeModalEmpty() {
        this.modalCtrl.dismiss();
    }

    applyFilter(event, type) {
        console.log('type', type);
        console.log('event', event);
        for (const prop in this.filters) {
            // if (event.detail.value !== "") {
                if (prop === type) {
                    console.log(`obj.${prop} = ${this.filters[prop]}`);
                    // console.log(`event`, event.detail.value);
                    console.log(`type`, type);
                    if (event.detail.value === "") {
                        delete this.filtersToApply[prop];
                    } else {
                        if (this.filters[prop].type === 'segment') {
                            this.filters[prop].value = +event.detail.value;
                        } else {
                            this.filters[prop].value = event.detail.value;
                        }
                        this.filtersToApply[prop] = this.filters[prop].value;
                    }
                }
            // }

        }
        //console.log('filters to aply', this.filtersToApply);
        this.filterData(this.data, this.filtersToApply);
    }

    filterData(items: any[], filter: { [key: string]: any }) {
        console.log('items: ', items);
        console.log('filter: ', filter);
        // let itemsFiltered = [];
        //Verificar si se debe filtrar en la API
        if (!this.filterInApi) {
            //Recorrer los Filtros a Aplicar   
            this.filteringPosts = true;
            for (const prop in filter) {
                console.log(`obj.${prop} = ${filter[prop]}`);
                //Verifico si la propiedad tiene valor "" ya que si lo tiene quiere decir que se solicita el arreglo sin filtrar por la propiedad actual
                if (filter[prop] !== "") {
                    this.dataFiltered = items.filter(item => {
                        return item.hasOwnProperty(prop) && item[prop] === filter[prop];
                    });
                }
            }
            this.filteringPosts = false;
            // return items;
        } else if (this.filterInApi && this.postTypeSlug) {
            this.filteringPosts = true;
            this.postsService.filterPosts(filter, this.postTypeSlug).pipe(
                finalize(() => {
                    this.filteringPosts = false;
                })
            ).subscribe((res: any) => {
                console.log('events search', res);
                this.dataFiltered = [...res.data];
                if (res.data.length === 0) {
                    console.log('No hay coincidencias');
                } else {
                    console.log(`Hay ${this.dataFiltered.length} coincidencias`);
                }
            }, (err: any) => {
                console.log('Ocurrio un error al filtrar los posts', err);
            });
        }
    }

}
