import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

    constructor(
        private router: Router,
        private apiService: ApiService,
        private modalService: NgbModal,
        public formBuilder: FormBuilder,
        private eventService: EventService,
        private calendar: NgbCalendar,
        private _lightbox: Lightbox,
        private _lightboxConfig: LightboxConfig,
        public translateService: TranslateService
        // private modalService: NzModalService,
        // private notification: NzNotificationService
    ) {
        _lightboxConfig.centerVertically = true
        _lightboxConfig.wrapAround = true
        _lightboxConfig.showImageNumberLabel = true
        _lightboxConfig.disableScrolling = true

        // this.eventService.setLoading(true)
        // this.apiService.getList('reports').subscribe({

        //     next: res => {
        //         console.log(res);

        //         this.listType = res
        //         this.eventService.setLoading(false)

        //     },
        //     error: e => {
        //         alert('lỗi')
        //         this.eventService.setLoading(false)

        //     }
        // })
    }

    listType = []

    formUpdate = {
        note: '',
        status: 0,
        id: 0,
        type_id: 0
    }
    breadCrumbItems
    type$ = this.apiService.getList('incident-type')
    // location$ = this.apiService.getList('location')

    searchTerm
    listData = []
    listDataAssign = []

    pageSize = 10
    pageIndex = 1
    totalElements = 0
    tableName = 'transactions'
    submitted: boolean
    formData: FormGroup

    selectedBooking
    selectedBookingTracks

    _albums = []
    params = ''
    // selectTrans: listData.id
    // get form() {
    //     return this.formData.controls
    // }

    ngOnInit() {
        this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.BreadcrumbTitle', active: true }];

        // this.fetchData()

    }
    // selectTrans(person:Person){
    //     this.selectedPerson = person;
    //   }
    // zoom = 8
    // center: google.maps.LatLngLiteral = { lat: 13.786377, lng: 100.608755 };

    open(i) {
        this._lightbox.open(this._albums, i);
    }

    close(): void {
        // close lightbox programmatically
        this._lightbox.close();
    }

    openModalImage(data) {
        console.log(data)
    }

    onChangePage(e) {
        this.pageIndex = e
        this.fetchData()
    }

    searching = false

    clearFilter() {
        this.selected = ''
        this.params = ''
        this.filter.type_id = -1
        this.filter.status = -1
        // this.filter.location_id = -1
        this.filter.start_date = 0
        this.filter.end_date = 0
        this.pageIndex = 1
        this.searching = false
        this.fetchData()
    }

    submitFilter() {
        this.params = ''
        Object.keys(this.filter).forEach(key => {
            console.log(key + '-' + this.filter[key])
            if (this.filter[key] >= 0) {
                this.params += `&${key}=${this.filter[key]}`
            }
        })
        if (this.params) {
            this.pageIndex = 1
            this.searching = true
            this.fetchData()
        }
    }

    fetchData() {
        // let params = ''
        // if(this.keyword){
        //     params ='&name='+this.keyword
        // }
        // if(this.selectedStation&& this.selectedStation.length >0){
        //     this.selectedStation.forEach(d => {
        //         params += `&station_id=${d}`
        //     })
        // }

        this.eventService.setLoading(true)
        this.apiService.getList(this.tableName + `?page=${this.pageIndex}&limit=${this.pageSize}${this.params}`
        ).subscribe({
            next: res => {
                const data = res
                // const meta = res['total']
                // this.totalElements= res.total
                this.listData = [...data]
                this.eventService.setLoading(false)
                this.totalElements = res['total']
            }
        })
    }


    openModal(content: any) {
        // this.apiService.successmsg()
        this.formData = this.makeForm()
        this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
    }

    onEdit(data, content) {
        console.log(data)
        this._albums = [...data.images].map(i => {
            const src = environment.imageHost + i.url;
            const classification = i.classification;
            const caption = i.filename;
            const thumb = src;
            return { src, caption, thumb, classification }
        })
        this.open(0)
    }

    viewDetails(data: any) {
        this.router.navigate(['/details', data.transaction_id]); 
    }
    onImgError(event) {
        event.target.src = './assets/images/img-error.jpg'
    }
    handleClick(id: string): void {
        // Chuyển hướng đến trang "pagedetail" với tham số id
        this.router.navigate(['/pagedetail', id]);
    }
    indexPrice = 0
    onDetailBooking(data, content) {
        if (data.id) {
            this.eventService.setLoading(true)
            this.apiService.getList(`incident/${data.id}`).subscribe({
                next: res => {
                    this.selectedBooking = res
                    this._albums = [...this.selectedBooking.images].map(i => {
                        const src = environment.imageHost + i.url;
                        const classification = i.classification;
                        const caption = i.filename;
                        const thumb = src;
                        return { src, caption, thumb, classification }
                    })
                    this.selectedBooking['imageClasstification'] = this._albums.find(i => i.classification)
                    // console.log(this.selectedBooking)
                    this.formUpdate.note = res.note
                    this.formUpdate.status = res.status
                    this.formUpdate.type_id = res.type_id
                    this.formUpdate.id = res.id
                    this.modalService.open(content, { centered: true, scrollable: true, windowClass: 'my-class' });
                    this.selectedBooking['lat'] = 0
                    this.selectedBooking['lng'] = 0
                    // if (this.selectedBooking.location_other && this.selectedBooking.location_other.latitude && this.selectedBooking.location_other.longitude) {
                    //     this.selectedBooking['lat'] = this.selectedBooking.location_other.latitude
                    //     this.selectedBooking['lng'] = this.selectedBooking.location_other.longitude
                    // } else if (this.selectedBooking.location_detail && this.selectedBooking.location_detail.lat && this.selectedBooking.location_detail.lng) {
                    //     this.selectedBooking['lat'] = this.selectedBooking.location_detail.lat
                    //     this.selectedBooking['lng'] = this.selectedBooking.location_detail.lng
                    // }
                    // this.center = this.selectedBooking
                    this.eventService.setLoading(false)
                },
                error: e => {
                    this.eventService.setLoading(false)
                }
            })
        }

    }
    onDetailB(data, content) {
        if (data.id) {
            this.eventService.setLoading(true)
            this.apiService.getList(`incident/${data.id}`).subscribe({
                next: res => {
                    this.listData = res
                    this.eventService.setLoading(false)
                },
                error: e => {
                    this.eventService.setLoading(false)
                }
            })
        }

    }
    updateFormNote() {
        if (this.formUpdate.id) {
            this.eventService.setLoading(true)
            this.apiService.editItem(this.tableName, this.formUpdate.id, this.formUpdate).subscribe({
                next: res => {
                    this.fetchData()

                    this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessage'), 'success')
                    this.eventService.setLoading(false)
                    this.modalService.dismissAll()
                },
                error: e => {
                    console.log(e)
                    this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessage'), 'error')
                    this.eventService.setLoading(false)
                }
            })

        }
    }

    getDetail(id) {

    }



    makeForm(d?) {
        let data = d ? d : <any>{}
        return this.formBuilder.group({
            id: [data.id],
            name: [data.name, [Validators.required]],
            description: [data.description],
            price: [data.price || 0, [Validators.required]],
            status: [data.status || false],
            image_url: [data.image_url, [Validators.required]],
            media_id: [data.media_id],
            parent_id: [data.parent_id || 0],
            currency: [data.currency || 'VND'],
        })
    }

    saveData() {
        this.submitted = true
        if (this.formData.valid) {
            const value = this.formData.value
            this.eventService.setLoading(true)
            if (value.id) {
                this.apiService.editItem(this.tableName, value.id, value).subscribe({
                    next: res => {
                        this.fetchData()
                        let a = this.translateService.instant('PAGE.FORM.Error')
                        this.apiService.showToast(a, ('PAGE.FORM.SuccessMessage'), 'success')
                        this.eventService.setLoading(false)
                    },
                    error: e => {
                        this.apiService.showToast('Lỗi', 'Có lỗi xảy ra', 'error')
                        this.eventService.setLoading(false)
                    }
                })
            } else {
                this.apiService.addItem(this.tableName, value).subscribe({
                    next: res => {
                        this.fetchData()
                        this.apiService.showToast('', 'Thêm mới thông tin thành công', 'success')
                        this.eventService.setLoading(false)
                        this.modalService.dismissAll()
                    },
                    error: e => {
                        this.apiService.showToast('Lỗi', 'Có lỗi xảy ra', 'error')
                        this.eventService.setLoading(false)
                    }
                })
            }

        } else {
            console.log('invalid', this.formData)
            Object.values(this.formData.controls).forEach(control => {
                if (control.status == 'INVALID') {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    filter = {
        type_id: -1,
        // location_id: -1,
        status: -1,
        start_date: -1,
        end_date: -1
    }

    hoveredDate: NgbDate;
    fromNGDate: NgbDate;
    toNGDate: NgbDate;

    model: NgbDateStruct;
    date: { year: number, month: number };
    // Select2 Dropdown
    selectValue: string[];

    hidden: boolean = true
    selected: any;
    @Input() fromDate: Date;
    @Input() toDate: Date;
    @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromNGDate = date;
            this.fromDate = new Date(date.year, date.month - 1, date.day);
            this.selected = '';
            this.filter.start_date = 0
            this.filter.end_date = 0

        } else if (this.fromDate && !this.toDate && (date.after(this.fromNGDate) || date.equals(this.fromNGDate))) {
            this.toNGDate = date;
            this.toDate = new Date(date.year, date.month - 1, date.day);
            this.hidden = true;
            // this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
            this.selected = moment(this.fromDate).format('DD/MM/YYYY') + '-' + moment(this.toDate).format('DD/MM/YYYY')
            this.filter.start_date = moment.utc(this.fromDate.toLocaleString()).startOf('days').unix()
            this.filter.end_date = moment.utc(this.toDate.toLocaleString()).endOf('days').unix()
            // this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

            this.fromDate = null;
            this.toDate = null;
            this.fromNGDate = null;
            this.toNGDate = null;

        } else {
            this.fromNGDate = date;
            this.fromDate = new Date(date.year, date.month - 1, date.day);
            this.selected = '';
            this.filter.start_date = 0
            this.filter.end_date = 0
        }
    }
    /**
    * Is hovered over date
    * @param date date obj
    */
    isHovered(date: NgbDate) {
        return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
    }

    /**
     * @param date date obj
     */
    isInside(date: NgbDate) {
        return date.after(this.fromNGDate) && date.before(this.toNGDate);
    }

    /**
     * @param date date obj
     */
    isRange(date: NgbDate) {
        return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
    }

    /**
     * Select the today
     */
    selectToday() {
        this.model = this.calendar.getToday();
    }

    clearDate() {
        this.selected = ''
        this.filter.start_date = 0
        this.filter.end_date = 0
    }

}
