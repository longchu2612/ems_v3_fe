/// <reference types="@types/googlemaps" />


import { EventService } from './../../core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { latLng, tileLayer } from 'leaflet';
import { Stat, Chat, Transaction, Data } from './dashboard.model';

import { statData, revenueChart, salesAnalytics, sparklineEarning, sparklineMonthly, chatData, transactions } from './data';
import { ChartType } from '../chart/chartist/chartist.model';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';


// import { ChartComponent } from "ng-apexcharts";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

/**
 * Dashboard Component
 */
export class DashboardComponent implements OnInit {
    // mapOptions = {

    //     mapTypeId: "satellite"
    // };
    // term: any;
    // chatData: Chat[];
    transactions: Transaction[];
    // statData: Stat[];

    apiLoaded: Observable<boolean>;

    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

    constructor(
        public formBuilder: FormBuilder,
        private apiService: ApiService,
        private eventService: EventService,
        private router: Router,
        private translate: TranslateService,
    ) {

    }
    role = JSON.parse(localStorage.getItem('currentUser')).role;
    pageSize = 10
    pageIndex = 1
    totalElements = 2
    tableName = 'dashboard'
    locations = [];
    data: Data
    listDataPie = <any>[];
    listDataTable = <any>[];
    listDataLinerevenue = <any>[];
    listDataLineprofit = <any>[];

    // Form submit
    chatSubmit: boolean;

    formData: FormGroup;

    listType = []
    totalProducts = [];
    productName = []
    dataHeader =<any>{}
    ngOnInit(): void {
        this.eventService.setLoading(true)
        const data = {
        }
        this.apiService.getListpost(this.tableName + '/count-by-dashboard-category', data).subscribe({
            next: (res) => {
                this.dataHeader = res
            }
        })
        this.getTableChart()
        this.getdataPiechart()
        // this.getprofitLinechart()
        this.getrevenueLinechart()
        this.eventService.setLoading(false)
    }

    // getprofitLinechart() {
    //     const data = {
    //     }
    //     this.apiService.getListpost(this.tableName + '/profit', data).subscribe({
    //         next: (res) => {
    //             this.listDataLineprofit = res
    //             this.updateChartData();
    //         }
    //     })
    // };
    getrevenueLinechart() {
        const data = {
        }
        this.apiService.getListpost(this.tableName + '/revenue', data).subscribe({
            next: (res) => {
                this.listDataLinerevenue = res;
                this.updateChartData();
            }
        })
    };
    getdataPiechart() {
        const data = {
        }
        this.apiService.getListpost(this.tableName + '/total-order', data).subscribe({
            next: (res) => {
                this.listDataPie = res
                this.updateChartData();
                
            }
        })
    };
    getTableChart() {
        const data = {
        }
        this.apiService.getListpost(this.tableName + '/top-product', data).subscribe({
            next: (res) => {
                this.listDataTable = res
                this.updateChartData();
            }
        })
    }
    updateChartData() {
        // Update data for Series A
        this.barChartData[0].data = this.listDataTable.map(a => a.total);
        this.barChartLabels = this.listDataTable.map(a => a.productName);
        this.lineChartData[0].data = this.listDataLinerevenue
        // this.lineChartData1[0].data = this.listDataLineprofit
        this.pieChartData = this.listDataPie.map(a => a.total);
        this.pieChartLabels = this.listDataPie.map(a => a.categoryName); 
    }


    // // this.totalElements = res.meta.total


    // console.log();

    // fetchData() {
    //     const data = {
    //     }
    //     this.eventService.setLoading(true)
    //     this.apiService.getListpost(this.tableName + '/top-product', data).subscribe({
    //         next: (res) => {
    //             this.listDataProducts = res
    //             console.log(this.listDataProducts);
    //             this.totalProducts = this.listDataProducts.map(a => a.total)
    //             this.productName = this.listDataProducts.map(a => a.productName)
    //             console.log(this.totalProducts);
    //             console.log(this.productName);
    //             // // this.totalElements = res.meta.total
    //             this.eventService.setLoading(false)
    //         }
    //     })
    // };

    //table chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartData: any[] = [
        { data: [], label: 'Số lượng' }
    ];
    public barChartLabels: string[]
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    // line chart profit
    public lineChartData1: any[] = [
        { data: [], label: ' VND' },
        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
    public lineChartLabels1: string[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    public lineChartType1: string = 'line';
    public lineChartLegend1: boolean = true;

    // Options for the line chart
    public lineChartOptions1: any = {
        responsive: true, // make the chart responsive
        maintainAspectRatio: false, // do not maintain aspect ratio
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true // start y-axis from zero
                }
            }]
        }
    };
    // Pie chart options
    public pieChartOptions: any = {
        responsive: true
    };
    public pieChartData: number[] = [40, 15, 40, 24, 1];
    public pieChartLabels: string[] = ['Món chính', 'Món ăn kèm', 'Món phụ', 'Đồ ăn chính 3', 'Món khai vị']
    public pieChartType: string = 'pie';
    public pieChartLegend: boolean = true;
    public pieChartColors: any[] = [
        {
            backgroundColor: ['#0066CC', '#C70039', '#FFC300', '#0047AB', '#581845']
        }
    ];

    // line chart revenue
    public lineChartData: any[] = [
        { data: [], label: ' VND' },
        // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
    public lineChartLabels: string[] = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    public lineChartType: string = 'line';
    public lineChartLegend: boolean = true;

    // Options for the line chart
    public lineChartOptions: any = {
        responsive: true, // make the chart responsive
        maintainAspectRatio: false, // do not maintain aspect ratio
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true // start y-axis from zero
                }
            }]
        }
    };
    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(this.totalProducts);
    }

    click(e) {
        e.stopPropagation();
        console.log(e)
    }
}
