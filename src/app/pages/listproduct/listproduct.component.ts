import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'leaflet';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { environment } from 'src/environments/environment';
import { RouterLink } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { Renderer2, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.scss']
})
export class ListproductComponent implements OnInit {


  constructor(
    private _eref: ElementRef,
    private router: Router,
    private apiService: ApiService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private eventService: EventService,
    private translateService: TranslateService
  ) { }

  searchTerm
  productData
  searchQuery: string = '';
  productsByCategory = {};
  listCategories = []
  listData = [
  ]
  listData2 = []
  listData3 = []
  listCategoriesName = [
    {id : null, categoryName : 'Tất cả',status: true},
  ]
  pageSize = 10
  pageIndex = 1
  totalElements = 0
  // tableName = 'workspaces'
  tableName1 = 'categories'
  // tableName2 = 'devices/active'
  // tableName3 = 'bankaccounts/active'
  tableName4 = 'workspaces/device-and-bankaccount'
  role = JSON.parse(localStorage.getItem('currentUser'))['role']
  submitted: boolean
  formData: FormGroup
  formData2: FormGroup
  listType = ['Trưởng nhóm', 'Phó nhóm', 'Thành viên']
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  breadCrumbItems
  hidden: boolean = true
  showDropdown = false;
  orderId
  get form() {
    return this.formData.controls
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.IncidentType', active: true }];
    // console.log(this.role);
    this.getProductsList(null, this.searchQuery)
    this.getCategoryList()
    this.orderId = localStorage.getItem('orderId')
    console.log(this.orderId);
    
    // this.fetchData()
    // this.fetchData2()
    // this.fetchData3()
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  isActive: boolean = false;

  toggleActive() {
    this.isActive = !this.isActive;
  }
  showProductList: { [key: string]: boolean } = {};
  toggleProductList(category: string) {
    this.showProductList[category] = !this.showProductList[category];
  }
  onMouseDown(event: MouseEvent) {
    const dropdown = document.getElementById('dropdown');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      this.showDropdown = false;
    }
  }
  selectCategory(category: string) {
    this.getProductsList(category, this.searchQuery)
  }
  onChangePage(e) {
    this.pageIndex = e
    this.fetchData()
  }
  performSearch() {
    this.getProductsList('',this.searchQuery)
  }
  getCategoryList() {
    const data = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "categoryName": this.filter.name,
    }
    this.apiService.getListpost('categories/list', data).pipe().subscribe(
      (data) => {
        this.listCategoriesName = this.listCategoriesName.concat(data['content']).filter(x => x.status);
      }, err => {
        console.log(err)
      })
  }
  getProductsList(categoryId, name) {
    const data = {
      // "pageIndex": this.pageIndex,
      "pageSize": 500,
      "name": this.filter.name,
      "categoryId" : categoryId
    }
    this.apiService.getListpost('products/list', data).pipe().subscribe(
      (data) => {
        this.productData = data['content']
        const listCategories = []
        const productsByCategory = []
        this.productData.filter(i => i.status == true).forEach(product => {
          if (!productsByCategory[product.categoryName]) {
            productsByCategory[product.categoryName] = [];
            listCategories.push(product.categoryName)

          }
          productsByCategory[product.categoryName].push(product);
        });
        this.listCategories = listCategories
        this.productsByCategory = productsByCategory
      }, err => {
        console.log(err)
      })
  }
  clearDate() {
    this.selected = ''
    this.filter.startdate = 0
    this.filter.enddate = 0
  }

  filter = {
    type_id: -1,
    name: '',
    // location_id: -1,
    status: -1,
    startdate: -1,
    enddate: -1
  }
  searching = false

  data = {}
  submitFilter() {
    Object.keys(this.filter).forEach(key => {
      console.log(key + '-' + this.filter[key])
      if (this.filter[key] || this.filter[key] >= 0) {
        this.data += `&${key}=${this.filter[key]}`
      }
    })

    if (this.data) {
      this.pageIndex = 1
      this.searching = true
      this.getProductsList(null, this.searchQuery)
    }
  }
  selected: any;

  clearFilter() {
    this.selected = ''
    this.filter.name = ''
    this.filter.type_id = -1
    this.filter.status = -1
    // this.filter.location_id = -1
    this.filter.startdate = 0
    this.filter.enddate = 0
    this.pageIndex = 1
    // this.searching = false
    this.getProductsList(null, this.searchQuery)
  }


  fetchData() {
    const data = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "name": this.filter.name,
    }
    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getListpost(this.tableName1 + `/list`, data
    ).subscribe({
      next: (res) => {
        // this.listData = res.workspaces
        this.listData = res['content'] ? res['content'] : [];
        this.totalElements = res['totalElements'] ? res['totalElements'] : 0;
        console.log(this.listData);

        this.eventService.setLoading(false)
      }
    })
  }

 
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

  addLang() {
    const language = this.form.language as FormArray
    let lang = this.makePrice()
    language.push(lang)
  }

  removeLang(i) {
    const language = this.form.language as FormArray
    language.removeAt(i)
  }

  openModal(content: any, data) {
    this.showDropdown = false
    if(this.orderId == null){
      this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('Bạn chưa chọn bàn'), 'error')
      return
    }
   else {
    console.log(data);
    this.submitted = false
    this.formData = this.makeForm(data)
    let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });}    
  }

  openModalLink(contentLink) {
    this.submitted = false
    this.formData2 = this.makeForm2({ language: [{}] })
    let a = this.modalService.open(contentLink, { centered: true, scrollable: true, size: 'lg' });
  }
  onEdit(data, content) {
    console.log(data)
    this.formData = this.makeForm(data)
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
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
  name = ''
  onDetailB(data, contentDetail) {
    this.formData = this.makeForm(data)
    this.modalService.open(contentDetail, { centered: true, scrollable: true, size: 'sl' });
    if (data.id) {
      this.apiService.getList(`categories/detail/${data.id}`).subscribe({
        next: res => {
          //   this.dataDetails = res
          this.name = res['categoryName'] ? res['categoryName'] : '';
          console.log(this.name);

        },
        error: e => {
          // this.eventService.setLoading(false)
        }
      })
    }
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
        this.apiService.deleteItem(this.tableName1 + `/delete`, data).subscribe(res =>
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
      productId: [data.id],
      note: [data.note],
      image: [data.image, [Validators.required]],
      name: [data.name, [Validators.required]],
      price: [data.price],
      quantity: [Math.max(1, Math.floor(data.quantity || 1)), [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^\d+$/)
      ]]    })
  }

  makeForm2(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      // id: [data.id],
      // imei : [data.imei, [Validators.required]],
      // description: [data.description],
      // price: [data.price || 0, [Validators.required]],
      // model : [data.model, [Validators.required]],
      // image_url: [data.image_url, [Validators.required]],
      device_id: [data.device_id, [Validators.required]],
      bankaccount_id: [data.bankaccount_id, [Validators.required]],
      // type: [data.type, [Validators.required]],
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

  viewDetails(data: any) {
    this.router.navigate(['/workspaces/detail-workspace', data.id]);
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

  saveData() {
    this.submitted = true
    if (this.formData.valid) {
      console.log(this.formData.value);
      const newData = this.formData.value;
  
      let cartOrders = JSON.parse(sessionStorage.getItem('cartOrders')) || [];
  
      // Kiểm tra xem mặt hàng mới có cùng ID với mặt hàng nào trong cartOrders không
      const existingItemIndex = cartOrders.findIndex(item => item.productId === newData.productId);
  
      if (existingItemIndex !== -1) {
          // Nếu có, tăng số lượng của mặt hàng đó
          cartOrders[existingItemIndex].quantity += newData.quantity;
      } else {
          // Nếu không, thêm mặt hàng mới vào mảng hiện có
          cartOrders.push(newData);
      }
  
      // Lưu mảng đã được cập nhật trở lại vào sessionStorage
      sessionStorage.setItem('cartOrders', JSON.stringify(cartOrders));
      this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('Đã thêm vào giỏ hàng'), 'success')
      this.submitted = false
      this.modalService.dismissAll()

    } else {
      this.apiService.showToast('Lỗi', 'Số lượng chưa đúng', 'error')
      console.log('invalid', this.formData)
      Object.values(this.formData.controls).forEach(control => {
        if (control.status == 'INVALID') {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveData2() {
    this.submitted = true
    if (this.formData2.valid) {
      const value = this.formData2.value
      // value['status'] = value['status'] == true ? 0 : 1
      // value['prices'][0]['condition'] = 1
      // value['prices'][1]['condition'] = 2
      // value['price']= value['prices']
      this.eventService.setLoading(true)
      if (value.id) {
        this.apiService.editItem(this.tableName4, value.id, value).subscribe({
          next: res => {
            this.submitted = false
            this.formData2.reset()
            // this.fetchData2()
            // this.fetchData3()
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('Đã thêm vào giỏ hàng'), 'success')
            this.eventService.setLoading(false)
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('Thêm thất bại'), 'error')
            this.eventService.setLoading(false)
          }
        })
      } else {
        this.apiService.addItem(this.tableName4, value).subscribe({
          next: res => {
            // this.fetchData2()
            // this.fetchData3()
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: this.translateService.instant('FORM.Success')
            });

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
              icon: "error",
              title: this.translateService.instant('FORM.ErrorMessageAdd')
            });
            this.eventService.setLoading(false)
            // this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.userNotExist'), 'error')
            // this.eventService.setLoading(false)
          }
        })
      }

    } else {
      console.log('invalid', this.formData2)
      Object.values(this.formData2.controls).forEach(control => {
        if (control.status == 'INVALID') {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }
  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

}
