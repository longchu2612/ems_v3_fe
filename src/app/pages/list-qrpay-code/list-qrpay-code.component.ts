import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
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
import { SafeUrl } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'app-list-qrpay-code',
    templateUrl: './list-qrpay-code.component.html',
    styleUrls: ['./list-qrpay-code.component.scss']
})
export class ListQrpayCodeComponent implements OnInit {

    //qrcode
    public qrCodeDownloadLink: SafeUrl = "";
    amountValue: number;
    areaValue: string;
    amountEntered: boolean = false;
    areaEntered: boolean = false;
    // qrCodeValue: string;
    // public stringQrCode: string = null;
    //qrcode

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

    listTypeMember = ['Trưởng nhóm', 'Phó nhóm', 'Thành viên']

    breadCrumbItems
    type$ = this.apiService.getList('incident-type')
    // location$ = this.apiService.getList('location')

    //qrcode
    searchTerm
    listData = []
    listQR = []
    listDataAssign = []
    listDataAccount = []
    pageSize = 10
    pageIndex = 1
    totalElements = 0
    tableName3 = 'qrcodes'
    tableName2 = 'workspaces/device-and-bankaccount'
    // tableName3 = 'bankaccounts/active'
    submitted: boolean
    formData: FormGroup


    selectedBooking
    selectedBookingTracks

    role = JSON.parse(localStorage.getItem('currentUser')).role;


    //day nay  =))) oke anh
    _albums = []
    params = ''
    // selectTrans: listData.id

    get form() {
        return this.formData.controls
    }
    ngOnInit() {
        this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.BreadcrumbTitle', active: true }];
        this.getListDevices()
        this.fetchData()
        
        // this.fetchData1()
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
        // this.filter.serial_number = ''
        // this.filter.type_id = -1
        this.filter.status = -1
        // this.filter.location_id = -1
        this.filter.startdate = 0
        this.filter.enddate = 0
        this.pageIndex = 1
        this.searching = false
        this.fetchData()
    }

    submitFilter() {
        this.params = ''
        Object.keys(this.filter).forEach(key => {
            // console.log(key + '-' + this.filter[key])
            if (this.filter[key] >= 0) {
                this.params += `&${key}=${this.filter[key]}`
            }
        })
        console.log(this.params);
        
        if (this.params) {
            this.pageIndex = 1
            this.searching = true
            this.fetchData()
        }
    }

    checkQR() {

    }

    fetchData() {
        this.eventService.setLoading(true)
        this.apiService.getList(this.tableName3 +`?page=${this.pageIndex}&limit=${this.pageSize}${this.params}`).subscribe({
            next: res => {
                const data = res.qrcodes
                this.listQR = data ? [...data] : []
                this.totalElements = res['pagination']['totalElements'] ? res['pagination']['totalElements'] : 0;
                
                this.eventService.setLoading(false)
            },
        })
    }

    list_serial_number = [];
    list_bankaccount = []

    fetchData1() {
        this.eventService.setLoading(true)
        this.apiService.getList(this.tableName2 +
            `?page=${this.pageIndex}&limit=${this.pageSize}${this.params}`
        ).subscribe({
            next: (res) => {
                this.listData = res
                this.listData.forEach((item) => {
                    if (item['bankaccount_id'] && item['device_id']) {
                        this.list_serial_number.push(item['device_id']);
                        this.list_bankaccount.push(item['bankaccount_id'])
                    }
                })

                this.totalElements = res.length
                this.eventService.setLoading(false)
            }
        })
    }


    list_id_account = [];

    getListDevices(params = '') {
        params = '&order=updated_at&direction=desc'
        
        if(this.role === 'admin') {
            return
        }
        this.eventService.setLoading(true)
        this.apiService.getList(this.tableName2 +
            `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
        ).subscribe({
            next: (res) => {
                this.eventService.setLoading(false)
            }
        })

    }


    getSerialNum(id) {
        let selectedItem = this.listData.filter(item => item.id == id)[0]
        console.log(id)
        return selectedItem.serial_number
    }

    detailAccount
    //day nhá thay thế thì lúc tạo qr lại k tạo đc // oke anh

    openModal(content: any, d?) {
        // this.apiService.successmsg()  
        this.fetchData1()
        this.qrCodeValue = ''
        this.formData = this.makeForm(d)
        this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
    }

    onEdit(data, content) {
        // console.log(data)
        this.filter.type_id = data.bankaccount_id
        //   console.log( this.filter)
        this.fetchData()
        // this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
        this.openModal(content, data)
    }

    viewDetails(data: any) {
        this.router.navigate(['/qrcodes', data.bankaccount_id]);
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
            this.apiService.editItem(this.tableName3, this.formUpdate.id, this.formUpdate).subscribe({
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

    detailQRCode(data: any) {
        this.router.navigate(['/qrcodes', data.id])
    }

    // mình chọn cái ô mã máy thì lấy được id và lưu vào form data, nhma lúc này mid vẫn rỗng => viết 1 hàm lấy mid dựa trên device_id => khi ấn tạo QR thì gọi hàm lấy mid ròi gán vào formData
    makeForm(d?) {
        let data = d ? d : <any>{}
        return this.formBuilder.group({
            id: [data?.id],
            user_id: JSON.parse(localStorage.getItem('currentUser'))['id'],
            token: JSON.parse(localStorage.getItem('currentUser'))['user_token'],
            device_id: [data.device_id || -1 || [Validators.required]],
            bankaccount_id: [data.bankaccount_id || -1],
            mid: [data.mid || 0],
            // name: [data.name, [Validators.required]],
            // description: [data.description],
            // price: [data.price || 0, [Validators.required]],
            // status: [data.status || false],
            // image_url: [data.image_url, [Validators.required]],
            // media_id: [data.media_id],
            amount: [data.amount, [Validators.required]],
            // currency: [data.currency || 'VND'],
            qr_string: [""],
            bill_number: [""]
        })
    }

    addQR = <any>{

    };

    qrCodeValue: string;
    bill_number: string
    midQR: string;
    amountQR: number;
    viewQRcode() {

        this.formData.get("mid").setValue(this.getSerialNum(this.formData.value.device_id))
        this.addQR = this.formData.value
        if (!this.addQR.id) {

        }
        this.apiService.addQRCode(this.addQR.user_id, this.addQR.amount, this.addQR.token, this.addQR.mid).subscribe({
            next: res => {
                this.qrCodeValue = res['data']['qr_string'] ? res['data']['qr_string'] : '',
                this.bill_number = res['data']['bill_number'] ? res['data']['bill_number'] : ''
                    this.midQR = this.addQR.mid
                    this.amountQR = this.addQR.amount
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
                Toast.fire({
                    icon: "success",
                    title: "Tạo QR thành công"
                });
                this.eventService.setLoading(false)
            },
            error: e => {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
                Toast.fire({
                    icon: "warning",
                    title: "Có lỗi xảy ra"
                });
                this.eventService.setLoading(false)
                // this.eventService.setLoading(false)
            }
        })
    }
    // hàm anyf à anh ??
    displayQR() {
        this.apiService.displayQRCode(this.addQR.user_id, this.addQR.amount, this.addQR.token, this.addQR.mid, this.qrCodeValue, this.bill_number).subscribe(res => {
            // this.formData.reset()// reset
            // this.fetchData()
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            Toast.fire({
                icon: "success",
                title: "Gửi QR thành công"
            });
            this.eventService.setLoading(false)

        })
        error: e => {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            Toast.fire({
                icon: "warning",
                title: "Có lỗi xảy ra"
            });
            // this.eventService.setLoading(false)
            this.eventService.setLoading(false)
        }
    }

    saveData() {

        this.submitted = true
        if (this.formData.valid) {
            this.formData.get("qr_string").setValue(this.qrCodeValue)
            this.formData.get("bill_number").setValue(this.bill_number)
            this.formData.get("device_id").setValue(this.list_serial_number[0])
            this.formData.get("bankaccount_id").setValue(this.list_bankaccount[0])
            const value = this.formData.value
            console.log(value)
            this.eventService.setLoading(true)
            if (value.id) {
                this.apiService.editItem(this.tableName3, value.id, value).subscribe({
                    next: res => {
                        this.fetchData()
                        let a = this.translateService.instant('PAGE.FORM.Error')
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                        Toast.fire({
                            icon: "success",
                            title: "Sửa thành công"
                        });
                        // this.eventService.setLoading(false)
                        this.eventService.setLoading(false)
                        this.modalService.dismissAll()
                    },
                    error: e => {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                        Toast.fire({
                            icon: "warning",
                            title: "Có lỗi xảy ra"
                        });
                        this.eventService.setLoading(false)
                        // this.modalService.dismissAll()
                    }

                })
            } else {
                this.apiService.addItem(this.tableName3, value).subscribe({
                    next: res => {
                        this.fetchData()
                        this.formData.reset()
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                        Toast.fire({
                            icon: "success",
                            title: "Thêm mới thành công"
                        });
                        this.eventService.setLoading(false)
                        // this.eventService.setLoading(false)
                        this.modalService.dismissAll()
                        // hàm này à anh ??kp e
                    },
                    error: e => {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                        });
                        Toast.fire({
                            icon: "warning",
                            title: "Có lỗi xảy ra"
                        });
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

    inforQR = []

    filter = {
        type_id: -1,
        // serial_number: "",
        // location_id: -1,
        status: -1,
        startdate: -1,
        enddate: -1
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
            this.filter.startdate = 0
            this.filter.enddate = 0

        } else if (this.fromDate && !this.toDate && (date.after(this.fromNGDate) || date.equals(this.fromNGDate))) {
            this.toNGDate = date;
            this.toDate = new Date(date.year, date.month - 1, date.day);
            this.hidden = true;
            // this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
            this.selected = moment(this.fromDate).format('DD/MM/YYYY') + '-' + moment(this.toDate).format('DD/MM/YYYY')
            this.filter.startdate = moment.utc(this.fromDate.toLocaleString()).startOf('days').unix()
            this.filter.enddate = moment.utc(this.toDate.toLocaleString()).endOf('days').unix()
            // this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

            this.fromDate = null;
            this.toDate = null;
            this.fromNGDate = null;
            this.toNGDate = null;

        } else {
            this.fromNGDate = date;
            this.fromDate = new Date(date.year, date.month - 1, date.day);
            this.selected = '';
            this.filter.startdate = 0
            this.filter.enddate = 0
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
        this.filter.startdate = 0
        this.filter.enddate = 0
    }

    onDelete(data) {
        Swal.fire({
            title: this.translateService.instant('FORM.Warning'),
            text: this.translateService.instant('FORM.WarningMessage'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#ff3d60',
            confirmButtonText: this.translateService.instant('FORM.WarningConfirm'),
            cancelButtonText: this.translateService.instant('FORM.Cancel')
        }).then(result => {
            if (result.value) {
                this.apiService.deleteItem(this.tableName3, data.id).subscribe(res =>
                    Swal.fire(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageDelete'), 'success')
                        .then(
                            res => {
                                this.fetchData();
                            }
                        )
                )
            }
        });
    }


}
