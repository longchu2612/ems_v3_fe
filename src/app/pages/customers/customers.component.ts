import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public router: Router,
    public formBuilder: FormBuilder,
    private eventService: EventService,
    private translateService: TranslateService
    // private modalService: NzModalService,
    // private notification: NzNotificationService
  ) { }
  hidden: boolean = true
  searchTerm
  listData = []
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  tableName = 'customers'

  submitted: boolean
  formData: FormGroup

  breadCrumbItems

  listType = []

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

  get form() {
    return this.formData.controls
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.IncidentType', active: true }];

    this.fetchData()
  }

  onChangePage(e) {
    this.pageIndex = e
    this.fetchData()
  }


  clearDate() {
    this.selected = ''
    this.filter.start_date = 0
    this.filter.end_date = 0
  }

  fetchData(params = '') {

    params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`).subscribe({
      next: (res) => {
        console.log(res)
        this.listData = res
        this.totalElements = res.length
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
      }
    })
  }

  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  addLang() {
    const language = this.form.language as FormArray
    let lang = this.makePrice()
    language.push(lang)
  }
  searching = false

  submitFilter() {

  }

  clearFilter() {

  }
  removeLang(i) {
    const language = this.form.language as FormArray
    language.removeAt(i)
  }
  viewDetails(data: any) {
    // Thực hiện điều hướng hoặc xử lý khi click vào hàng trong bảng
    // Ví dụ: Sử dụng Router để điều hướng đến trang chi tiết với dữ liệu được chọn
    this.router.navigate(['/details', data.id]); // Điều hướng đến trang chi tiết với ID của dữ liệu được chọn
  }

  openModal(content: any) {
    // this.apiService.successmsg()
    this.submitted = false
    this.formData = this.makeForm({ language: [{}] })
    let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
  }

  onEdit(data, content) {
    console.log(data)
    this.formData = this.makeForm(data)
    // this.uploadedImage = data.media.url
    this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
  }

  selectedIncident = null
  selectedKeyword = null

  makeFormKeyword(d) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.id],
      name: [data.name],
      incident_type_id: [data.incident_type_id]
    })
  }

  fetchKeyword() {
    this.dataKeyword = []
    this.eventService.setLoading(true)
    this.apiService.getList(`keyword?type_id=${this.selectedIncident.id}`).subscribe({
      next: res => {
        console.log(res)
        this.dataKeyword = [...res]
        this.eventService.setLoading(false)
      }
    })
  }

  dataKeyword = []

  formEditKeyword: FormGroup
  formNewKeyword: FormGroup
  editKeyword(data, index) {
    this.formEditKeyword = this.makeFormKeyword(data)
    this.selectedKeyword = data
  }

  onSubmitFormKeyword(type) {
    if (type == 1) {
      if (this.formEditKeyword.valid) {
        const value = this.formEditKeyword.value
        this.eventService.setLoading(true)
        this.apiService.editItem('keyword', value.id, value).subscribe({
          next: res => {
            this.selectedKeyword = null
            this.fetchKeyword()
            this.eventService.setLoading(false)

          }
        })
      }
    } else {
      if (this.formNewKeyword.valid) {
        const value = this.formNewKeyword.value
        this.eventService.setLoading(true)
        this.apiService.addItem('keyword', value).subscribe({
          next: res => {
            this.eventService.setLoading(false)
            this.formNewKeyword.reset({ incident_type_id: this.selectedIncident.id })
            this.fetchKeyword()
          }
        })
      }
    }
  }

  onOpenKeywordModal(content, incident) {
    this.selectedIncident = incident
    this.fetchKeyword()
    this.formNewKeyword = this.makeFormKeyword({ incident_type_id: this.selectedIncident.id })
    this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
  }

  defaultPrices = [
    { condition: 1, price: 0, unit: '' },
    { condition: 2, price: 0, unit: '' }
  ]

  onDeleteKeyword(id) {
    if (id) {
      this.eventService.setLoading(true)
      this.apiService.deleteItem('keyword', id).subscribe(res => {

        Swal.fire(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageDelete'), 'success')
          .then(
            res => {
              this.fetchKeyword();

            }
          )
        this.eventService.setLoading(false)

      }

      )
    }
  }

  onDelete(data, id) {
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
        this.apiService.deleteItem(this.tableName, data, id).subscribe(res =>
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


  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.id],
      full_name: [data.full_name, [Validators.required]],
      customer_code: [data.customer_code , [Validators.required]],
      // language: this.makePrices(data.language || [{}])
      // description: [data.description],
      // price: [data.price || 0, [Validators.required]],
      // prices: this.makePrices(data.prices || this.defaultPrices),
      status: [data.status || 0],
      // image_url: [data.image_url, [Validators.required]],
      // media_id: [data.media_id],
      // parent_id: [data.parent_id || 0],
      // currency: [data.currency || 'VND'],
    })
  }

  makePrices(data = []) {
    let arr = new FormArray([]);
    data.forEach(i => {

      arr.push(this.makePrice(i))
    })
    return arr;
  }

  makePrice(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      key: [data.key, [Validators.required]],
      // price: [data.price, [Validators.required, Validators.min(0)]],
      value: [data.value, [Validators.required]],
      // id: [data.id]
    })
  }

  uploadedImage
  addCustomer(){
    
  }

  saveData() {
    this.submitted = true
    if (this.formData.valid) {
      const value = this.formData.value
      value['status'] = value['status'] == true ? 1 : 0
      // value['prices'][0]['condition'] = 1
      // value['prices'][1]['condition'] = 2
      // value['price']= value['prices']
      this.eventService.setLoading(true)
      if (value.id) {
        this.apiService.editItem(this.tableName, value.id, value).subscribe({
          next: res => {
            this.submitted = false
            this.formData.reset()
            this.fetchData()
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessage'), 'success')
            this.eventService.setLoading(false)
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessage'), 'error')
            this.eventService.setLoading(false)
          }
        })
      } else {
        this.apiService.addItem(this.tableName, value).subscribe({
          next: res => {
            this.fetchData()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageAdd'), 'success')
            this.eventService.setLoading(false)
            this.modalService.dismissAll()
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessageAdd'), 'error')
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
}

