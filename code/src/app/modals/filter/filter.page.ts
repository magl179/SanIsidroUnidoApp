import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from '@ionic/angular';
import { IBasicFilter } from 'src/app/interfaces/models';




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
    filters: any;
    dataFiltered: any = [];
    filtersToApply: any = {};

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams
    ) {
        //console.log('data received', this.data);
        console.table(this.navParams);
        this.data = this.navParams.data.data;
        this.filters = this.navParams.data.filters;
        this.dataFiltered.push(...this.data);
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
        for (const prop in this.filters) {
            // if (event.detail.value !== "") {
                if (prop === type) {
                    console.log(`obj.${prop} = ${this.filters[prop]}`);
                    // console.log(`event`, event.detail.value);
                    console.log(`type`, type);
                    this.filters[prop].value = event.detail.value;
                    if (event.detail.value === "") {
                        delete this.filtersToApply[prop];
                    } else {
                        this.filtersToApply[prop] = this.filters[prop].value;
                    }
                }
            // }

        }
        console.log('filters to aply', this.filtersToApply);
        this.dataFiltered = this.filterData(this.data, this.filtersToApply);
    }

    filterData(items: any[], filter: { [key: string]: any }) {
        console.log('items: ', items);
        console.log('filter: ', filter);
        //Recorrer los Filtros a Aplicar
        for (const prop in filter) {
            console.log(`obj.${prop} = ${filter[prop]}`);
            //Verifico si la propiedad tiene valor "" ya que si lo tiene quiere decir que se solicita el arreglo sin filtrar por la propiedad actual
            if (filter[prop] !== "") {
                items = items.filter(item => {
                    return item.hasOwnProperty(prop) && item[prop] === filter[prop];
                });
            }
        }
        return items;
    }

}
