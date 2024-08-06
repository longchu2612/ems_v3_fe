import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { validatePassword } from 'firebase/auth';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private eventService: EventService,
    private translateService: TranslateService,
    public router: Router
    // private modalService: NzModalService,
    // private notification: NzNotificationService
  ) { }
  searchTerm
  // listData = []
  listData = <any>[]
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  tableName = 'users'
  listStatus = ['0', '1']
  listRole = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Chef' },
    { id: 4, name: 'Waiter' },
    { id: 5, name: 'Cashier' }
  ]
  // listRole = ['Quản trị viên','Người dùng']
  role = JSON.parse(localStorage.getItem('currentUser')).role;

  submitted: boolean
  formData: FormGroup

  breadCrumbItems

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
  filter = {
    type_id: -1,
    fullName: '',
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
      this.fetchData()
    }
  }
  selected: any;
  clearFilter() {
    this.selected = ''
    this.filter.fullName = ''
    this.filter.type_id = -1
    this.filter.status = -1
    // this.filter.location_id = -1
    this.filter.startdate = 0
    this.filter.enddate = 0
    this.pageIndex = 1
    // this.searching = false
    this.fetchData()
  }

  fetchData() {
    const data = {
      "pageIndex": this.pageIndex,
      "pageSize": this.pageSize,
      "fullName": this.filter.fullName,
    }
    this.eventService.setLoading(true)
    this.apiService.getListpost(this.tableName + `/list`, data
    ).subscribe({
      next: (res) => {
        this.listData = res['content'] ? res['content'] : []
        this.eventService.setLoading(false)
        this.totalElements = res['totalElements']
      }
    })
  }
  resetPassword(data) {
    const dataPost = {
      // 'id': data.id
    }
    this.eventService.setLoading(true)
    this.apiService.editItem('users/reset-password' ,data.userId , dataPost
    ).subscribe({
      next: (res) => {
        this.listData = res['content'] ? res['content'] : []
        this.eventService.setLoading(false)
        this.totalElements = res['totalElements']
        Swal.fire(this.translateService.instant('FORM.Success'), this.translateService.instant('Đặt lại thành công'), 'success')
        this.fetchData()
      }
    })
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

  openModal(content: any) {
    // this.apiService.successmsg()
    this.submitted = false
    this.formData = this.makeForm()
    let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
  }
  roleNameDetails = ''
  onEdit(data, content) {
    this.roleNameDetails = data.roleName
    console.log(this.roleNameDetails)
    this.formData = this.makeForm(data)
    this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
  }
  onDetail(data, contentDetail) {
    this.formData = this.makeForm(data)
    this.modalService.open(contentDetail, { centered: true, scrollable: true, size: 'xl' });
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

  onDelete(data) {
    Swal.fire({
      title: this.translateService.instant('Cảnh báo'),
      text: this.translateService.instant('Bạn có chắc chắn muốn xóa'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#ff3d60',
      confirmButtonText: this.translateService.instant('FORM.WarningConfirm'),
      cancelButtonText: this.translateService.instant('FORM.Cancel')

    }).then(result => {
      if (result.value) {
        console.log(data)
        this.apiService.deleteItem(this.tableName + `/delete`, data).subscribe(res =>
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

  nameLengthValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value.length < 10) {
      return { 'nameLength': true };
    }
    return null;
  }
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.userId],
      phone: [data.phone, [Validators.required, Validators.pattern('^(84|0[3|5|7|8|9])+([0-9]{8})$')]],
      userName: [data.userName, [Validators.required]],
      email: [data.email, [Validators.required, Validators.email]],
      // price: [data.price || 0, [Validators.required]],
      fullName: [data.fullName, [Validators.required, this.nameLengthValidator]],
      // image_url: [data.image_url, [Validators.required]],
      // password: [data.password, [Validators.required]],
      roleId: [data.roleId, [Validators.required]],
      // roleId: [parseInt(data.roleId), [Validators.required]],
    })
  }
  validateStatus(control) {
    const value = control.value;

    // Kiểm tra xem giá trị là 0 hoặc 1 không
    if (value !== 0 && value !== 1) {
      return { 'invalidStatus': true };
    }

    return null; // Giá trị hợp lệ
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


  saveData() {
    this.submitted = true
    if (this.formData.valid) {
      const value = this.formData.value
      this.eventService.setLoading(true)
      if (value.id) {
        this.apiService.editItem(this.tableName + `/update`, value.id, value).subscribe({
          next: res => {
            console.log(value.roleId);

            this.submitted = false
            this.formData.reset()
            this.fetchData()
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('Thành công'), this.translateService.instant('Sửa hoàn tất'), 'success')
            this.eventService.setLoading(false)
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('Lỗi'), this.translateService.instant('Sửa thất bại'), 'error')
            this.eventService.setLoading(false)
          }
        })
      } else {
        this.apiService.addItem(this.tableName + `/add`, value).subscribe({
          next: res => {
            this.fetchData()
            this.apiService.showToast(this.translateService.instant('Thành công'), this.translateService.instant('Thêm mới thành công'), 'success')
            this.eventService.setLoading(false)
            this.modalService.dismissAll()
          },
          error: e => {
            console.log(e);

            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessage'), 'error')
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
