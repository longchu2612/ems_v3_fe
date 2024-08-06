import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

const alphaNumericPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/; // Biểu thức chính quy để kiểm tra chứa chữ cái và số

const alphaNumericValidator = Validators.pattern(alphaNumericPattern);

@Component({
  selector: 'app-tokens-manage',
  templateUrl: './tokens-manage.component.html',
  styleUrls: ['./tokens-manage.component.scss']
})

export class TokensManageComponent implements OnInit {


  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private eventService: EventService,
    private translateService: TranslateService
    // private modalService: NzModalService,
    // private notification: NzNotificationService
  ) { }

  searchTerm
  listData = <any>[]
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  tableName = 'tokens'

  submitted: boolean
  formData: FormGroup
  role = JSON.parse(localStorage.getItem('currentUser'))['role']
  breadCrumbItems

  get form() {
    return this.formData.controls
  }

  ngOnInit() {
    // this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.IncidentType', active: true }];

    this.fetchData()
  }

  onChangePage(e) {
    this.pageIndex = e
    this.fetchData()
  }


  fetchData(params = '') {
    params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        console.log(res)
        // this.listData = res
        this.listData = res['tokens'] ? res['tokens'] : [];
        this.totalElements = res['pagination']['totalElements'] ? res['pagination']['totalElements'] : '';
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
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
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
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
        this.apiService.deleteItem(this.tableName, data).subscribe(res =>
          Swal.fire(this.translateService.instant('Thành công'), this.translateService.instant('Đã xóa thành công'), 'success')
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
      partner: [data.partner, [Validators.required]],
      // description: [data.description],
      // price: [data.price || 0, [Validators.required]],
      status: [data.status, [Validators.required]],
      // image_url: [data.image_url, [Validators.required]],
      token: [data.token, [Validators.required]],
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

  saveData() {
    this.submitted = true
    if (this.formData.valid) {
      const value = this.formData.value
      // value['status'] = value['status'] == true ? 1 : 0
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
            this.apiService.showToast(this.translateService.instant('Thành công'), this.translateService.instant('Sửa hoàn tất'), 'success')
            this.eventService.setLoading(false)
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('Lỗi'), this.translateService.instant('Sửa thất bại'), 'error')
            this.eventService.setLoading(false)
          }
        })
      } else {
        this.apiService.addItem(this.tableName, value).subscribe({
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
