import { Transaction } from './../dashboard/dashboard.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidatorFn, Validators } from '@angular/forms';
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
  selector: 'app-kitchens',
  templateUrl: './kitchens.component.html',
  styleUrls: ['./kitchens.component.scss']
})
export class KitchensComponent implements OnInit {
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

  listType = ["Tầng 1", "Tầng 2"]
  listStatus = [{
    id: 1,
    name: 'Đang dùng'
  },
  {
    id: 0,
    name: 'Trống'
  },]
  formUpdate = {
    note: '',
    status: 0,
    id: 0,
    type_id: 0
  }
  breadCrumbItems
  role = JSON.parse(localStorage.getItem('currentUser'))['role']
  type$ = this.apiService.getList('incident-type')
  // location$ = this.apiService.getList('location')

  searchTerm
  listData = []
  listDataDone = []
  listDataDevices = []
  listDataAssign = []

  pageSize = 10
  pageIndex = 1
  totalElements = 0
  tableName = 'transactions'
  tableName2 = 'devices'
  submitted: boolean
  formData: FormGroup

  selectedBooking
  selectedBookingTracks

  _albums = []
  params = ''
  groupedData = []
  groupedDataDone = []
  convertedData = []
  convertedDataDone = []
  convertedDataItem = []
  convertedDataItemDone = []
  get form() {
    return this.formData.controls
  }
  // selectTrans: listData.id
  // get form() {
  //     return this.formData.controls
  // }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.BreadcrumbTitle', active: true }];
    this.fetchDataPending()
    this.fetchDataDone()
    // this.fetchData1()

  }
  // selectTrans(person:Person){
  //     this.selectedPerson = person;
  //   }
  // zoom = 8
  // center: google.maps.LatLngLiteral = { lat: 13.786377, lng: 100.608755 };
  reloadData(){
    this.toggleActive('tableButton')
    this.toggleActive('priorityButton')
    this.fetchDataPending()
    this.fetchDataDone()
  }
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
    this.fetchDataPending()
  }
  toDone(dataIndex){
    const data = {
        "quantity": 1,
    }
    console.log(dataIndex)
    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/serve' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchDataPending()
        this.fetchDataDone()
        this.eventService.setLoading(false)
      }
    })
  }
  toDoneAll(dataIndex){
    const data = {
        "quantity": dataIndex.inProgress,
    }
    console.log(dataIndex)
    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/serve' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchDataPending()
        this.fetchDataDone()
        this.eventService.setLoading(false)
      }
    })
  }
  toPending(dataIndex){
    const data = {
        "quantity":1
    }

    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/process' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchDataPending()
        this.fetchDataDone()
        this.eventService.setLoading(false)
      }
    })
  }
  toPendingAll(dataIndex){
    const data = {
        "quantity":dataIndex.serving
    }
    console.log(data)
    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/process' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchDataPending()
        this.fetchDataDone()

        this.eventService.setLoading(false)
      }
    })
  }
  searching = false

  clearFilter() {
    this.selected = ''
    this.params = ''
    this.filter.serialnumber = ''
    this.filter.type_id = -1
    this.filter.status = -1
    // this.filter.location_id = -1
    this.filter.start_date = 0
    this.filter.end_date = 0
    this.pageIndex = 1
    this.searching = false
    this.fetchDataPending()
  }

  submitFilter() {

    this.params = ''
    Object.keys(this.filter).forEach(key => {
      console.log(key + '-' + this.filter[key])
      if (this.filter[key]) {
        this.params += `&${key}=${this.filter[key]}`
      }
    })
    if (this.params) {
      this.pageIndex = 1
      this.searching = true
      this.fetchDataPending()
    }
  }
  toggleItems(data: any) {
    data.showItems = !data.showItems;
  }
  toggleItemsDone(data: any) {
    data.showItemsDone = !data.showItemsDone;
  }
  activeButton: string = 'priorityButton'; // Biến để theo dõi nút đang được active

  toggleActive(button: string) {
      this.activeButton = button;
      this.groupedData = []
      this.convertedData = []
      this.convertedDataItem = []

        const data = {
          "status" : 2

        }
        this.eventService.setLoading(true)
        this.apiService.getListpost('order-detail/list', data
        ).subscribe({
          next: res => {
            this.listData = res['content'] ? res['content'] : [];
            this.eventService.setLoading(false)
            this.totalElements = res['totalElements'] ? res['totalElements'] : '';
          }
        })
        if(this.activeButton === 'tableButton'){
        this.configDatatable()
        this.fetchDataDone()
        }
  }
  configDatatable(){
    
    this.listData.forEach(item => {
      let tableName = item.tableName;
      if (this.groupedData[tableName]) {
          this.groupedData[tableName].push(item);
      } else {
          this.groupedData[tableName] = [item];
      }
      
    });
    for (let tableId in this.groupedData) {
      let tableData = {
          tableName: tableId,
          items: this.groupedData[tableId]
      };
      this.convertedData.push(tableData);
      this.convertedDataItem = tableData['items'] ? tableData['items'] : []
      console.log(this.convertedDataItem);
      
    }
  }
  configDatatableDone(){
    
    this.listDataDone.forEach(item => {
      let tableName = item.tableName;
      if (this.groupedDataDone[tableName]) {
          this.groupedDataDone[tableName].push(item);
      } else {
          this.groupedDataDone[tableName] = [item];
      }
      
    });
    for (let tableId in this.groupedDataDone) {
      let tableData = {
          tableName: tableId,
          items: this.groupedDataDone[tableId]
      };
      this.convertedDataDone.push(tableData);
      this.convertedDataItemDone = tableData['items'] ? tableData['items'] : []
      console.log(this.convertedDataItem);
      
    }
  }
  fetchDataPending() {
    const data = {
      "status" : 2
    }

    this.eventService.setLoading(true)
    this.apiService.getListpost('order-detail/list', data
    ).subscribe({
      next: res => {
        this.listData = res['content'] ? res['content'] : [];
        this.eventService.setLoading(false)
        this.totalElements = res['totalElements'] ? res['totalElements'] : '';
      }
    })
  }
  fetchDataDone() {
    this.groupedDataDone = []
    this.convertedDataDone = []
    this.convertedDataItemDone = []
    const data = {
      "status" : 3
    }
    this.eventService.setLoading(true)
    this.apiService.getListpost('order-detail/list', data
    ).subscribe({
      next: res => {
        this.listDataDone = res['content'] ? res['content'] : [];
        this.eventService.setLoading(false)
        this.totalElements = res['totalElements'] ? res['totalElements'] : '';
      }
    })
    if(this.activeButton === 'tableButton'){
      this.configDatatableDone()
      }
  }
  getSerialNum(id) {
    let selectedItem = this.listDataDevices.filter(item => item.id == id)[0]
    console.log(id)
    return selectedItem.serial_number
  }
  openModal(content: any , data) {
    // this.apiService.successmsg()
    this.formData = this.makeForm()
    this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
  }
  onEdit(data, content) {
    console.log(data)
    this.formData = this.makeForm(data)
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
  }
  viewDetails(data: any) {
    this.router.navigate(['transactions/details-transactions', data.id]);
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
          this.fetchDataPending()

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

  getListDevices(params = '') {
    params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName2 +
      `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        // console.log(res)
      }
    })

  }
  nonNegativeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value !== null && (isNaN(value) || value < 1)) {
        return { 'nonNegative': true };
      }
      return null;
    };
  }
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.id],
      quantity: [data.quantity, [Validators.required,this.nonNegativeValidator()]],
    })
  }

  saveData(data) {
    this.submitted = true
    if (this.formData.valid) {
      const value = this.formData.value
      const data = {
        "status" : 2,
        "quantity" : value.quantity
      }

      this.apiService.getListpost('order-detail/list', data
      ).subscribe({
        next: res => {
          this.listData = res['content'] ? res['content'] : [];
          this.totalElements = res['totalElements'] ? res['totalElements'] : '';
        
        }
      })
      this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessage'), 'success')
      this.modalService.dismissAll()
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
    end_date: -1,
    serialnumber: ''
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
        this.apiService.deleteItem('tables' + `/delete`, data).subscribe(res =>
          Swal.fire(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageDelete'), 'success')
            .then(
              res => {
                this.fetchDataPending();
              }
            )
        )
      }
    });
  }


}
