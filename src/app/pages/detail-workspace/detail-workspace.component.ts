import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from './../dashboard/dashboard.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface listData {
  created_at: string,
  customer_id: number,
  device_id: number,
  id: number,
  status: number,
  total: number,
  transaction_code: string,
  updated_at: string,
}

@Component({
  selector: 'app-detail-workspace',
  templateUrl: './detail-workspace.component.html',
  styleUrls: ['./detail-workspace.component.scss']
})
export class DetailWorkspaceComponent implements OnInit {
  params = ''
  phone: Number
  filter = {
    // location_id: -1,
    status: -1,
    start_date: -1,
    end_date: -1
  }
  data = <any>{}
  dataMember = <any>{}
  data1 = <any>{}
  data2 = <any>{}
  listData = []
  listData1 = []
  listData2 = []
  listDataDivices = []
  id: number = 0;
  // eventService: any;
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  totalElements1 = 2
  formData2: FormGroup
  tableName: string = 'workspaces/';
  tableName2 = 'devices/active'
  role = JSON.parse(localStorage.getItem('currentUser')).role;
  // public person  
  constructor(
    public eventService: EventService,
    private apiService: ApiService,
    public activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    // console.log(this.role);
    // console.log(this.listData);

    // this.route.params.subscribe(params => {
    //   let id = Number.parseInt(params['id']);
    //   this.person = this.peopleService.get(id);
    // });
    this.fetchData();
    this.fetchData1();
    this.fetchData2();
    this.fetchDataDevices()
    this.fetchDataBankAccount()
    this.fetchDataMember()
  }

  countMember: number
  countTransaction: number

  listMember = []
  fetchData() {

    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + this.id
      + `?page=${this.pageIndex}&limit=${this.pageSize}${this.params}`
    ).subscribe({
      next: (res) => {
        this.data = res
        this.listData = this.data
        this.dataMember = res.members
        this.listMember = this.dataMember
        this.countMember = res.members.length ? res.members.length : 0
        this.countTransaction = res.transactions.length ? res.transactions.length : 0
        // this.totalElements = res.length
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
      }
    })
  }

  fetchData1() {

    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + this.id
      // + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.data1 = res.members
        this.listData1 = this.data1
        console.log(this.listData1)
        this.totalElements = res.length
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
      }
    })
  }

  searching = false

  submitFilter() {
    this.getByPhone()
  }

  phoneResultsName: string = '';
  phoneResultsAddress: string = '';
  filterNameTable = 'users/get-by-phone'
  getByPhone() {
    const requestData = {
      phone: this.phone
    }
    this.eventService.setLoading(true)
    this.apiService.getbyphone(this.filterNameTable, requestData
      // + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        const dataPhone = res['data'];
        this.phoneResultsName = dataPhone['full_name'] ? dataPhone['full_name'] : '';
        this.phoneResultsAddress = dataPhone['address'] ? dataPhone['address'] : '';
        // console.log(this.phoneResultsAddress);
        // console.log(this.phoneResultsName);
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
        this.searching = true
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
          icon: "error",
          title: this.translateService.instant('Số điện thoại không tồn tại')
        });
        this.eventService.setLoading(false)
        // this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.userNotExist'), 'error')
        // this.eventService.setLoading(false)
      }
    })
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

  makeFormMember(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      phone: [data.phone, [Validators.required]],
      type: [data.type, [Validators.required]],
      // currency: [data.currency || 'VND'],
      workspace_id: this.activatedRoute.snapshot.params['id'],
    })
  }

  allMoney: number = 0
  fetchData2() {

    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + this.id
      // + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.data2 = res.transactions
        this.listData2 = this.data2
        this.totalElements1 = res.length
        this.allMoney = this.data2.reduce((acc, current) => acc + current.total, 0)
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
      }
    })
  }

  list_serial_number = []

  fetchDataDevices(params = '') {
    params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName2 +
      `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        // this.listData = res.workspaces
        this.listDataDivices = res['devices'] ? res['devices'] : [];
        // console.log(this.listDataDivices)
        this.listDataDivices.forEach((item) => {
          if (item['id']) {
            this.list_serial_number.push(item['id']);
          }

        })
        console.log(this.list_serial_number)
        this.totalElements = res.length
        this.eventService.setLoading(false)
      }
    })
  }

  openModalLink(contentLink) {
    this.submitted = false
    this.formData2 = this.makeForm2({ language: [{}] })
    let a = this.modalService.open(contentLink, { centered: true, scrollable: true, size: 'lg' });
  }

  tableName3 = 'bankaccounts/active'
  list_id_account = []
  listDataBankAccount = []
  submitted: boolean
  tableName4 = 'workspaces/device-and-bankaccount'

  fetchDataBankAccount(params = '') {
    params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName3 + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.listDataBankAccount = res['bankaccounts'] ? res['bankaccounts'] : [];
        console.log(this.listDataBankAccount)

        this.listDataBankAccount.forEach((item) => {
          if (item['id']) {
            this.list_id_account.push(item['id']);
          }

        }
        )

        // console.log(this.list_id_account)
        this.totalElements = res.length
        // console.log(this.totalElements)
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
      }
    })
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
            this.fetchDataDevices()
            this.fetchDataBankAccount()
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessage'), 'success')
            this.eventService.setLoading(false)
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('Thêm không thành công'), 'error')
            this.eventService.setLoading(false)
          }
        })
      } else {
        this.apiService.addItem(this.tableName4, value).subscribe({
          next: res => {
            this.fetchDataDevices()
            this.fetchDataBankAccount()
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
              title: this.translateService.instant('Thêm không thành công')
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

  get form() {
    return this.formDataMember.controls
  }

  formDataMember: FormGroup
  listType = ['Trưởng nhóm', 'Phó nhóm', 'Thành viên']
  tableNameMember = 'members'

  openModalMember(contentMember: any) {
    this.submitted = false
    this.formDataMember = this.makeFormMember({ language: [{}] })
    let a = this.modalService.open(contentMember, { centered: true, scrollable: true, size: 'lg' });
  }

  listDataMember = []

  fetchDataMember() {
    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableNameMember +
      `?page=${this.pageIndex}&limit=${this.pageSize}${this.params}`
    ).subscribe({
      next: (res) => {
        // this.listData = res.members
        this.listDataMember = res['members'] ? res['members'] : [];
        this.totalElements = res['pagination']['totalElements'] ? res['pagination']['totalElements'] : '';
        this.eventService.setLoading(false)
      }
    })
  }

  saveDataMember() {

    this.submitted = true
    if (this.formDataMember.valid) {
      const value = this.formDataMember.value
      // value['status'] = value['status'] == true ? 0 : 1
      // value['prices'][0]['condition'] = 1
      // value['prices'][1]['condition'] = 2
      // value['price']= value['prices']
      this.eventService.setLoading(true)
      if (value.id) {
        this.apiService.editItem(this.tableNameMember, value.id, value).subscribe({
          next: res => {
            this.submitted = false
            this.formDataMember.reset()
            this.fetchDataMember()
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessage'), 'success')
            this.eventService.setLoading(false)
          },
          error: e => {
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('Thêm không thành công'), 'error')
            this.eventService.setLoading(false)
          }
        })
      } else {
        this.apiService.addItem(this.tableNameMember, value).subscribe({
          next: res => {
            this.fetchDataMember()
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
            window.location.reload();
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
              title: this.translateService.instant('Thêm không thành công')
            });
            this.eventService.setLoading(false)
            // this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.userNotExist'), 'error')
            // this.eventService.setLoading(false)
          }
        })
      }

    } else {
      console.log('invalid', this.formDataMember)
      Object.values(this.formDataMember.controls).forEach(control => {
        if (control.status == 'INVALID') {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
