import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

// interface listData {
//   created_at: string,
//   customer_id: number,
//   device_id: number,
//   id: number,
//   status: number,
//   total: number,
//   transaction_code: string,
//   updated_at: string,
// }

interface dataPerson {
  full_name: string,
  phone: number,
  role: string,
  id: number,
  // status: number,
  // total: number,
  address: string,
  // updated_at: string,
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  // listBankname = ['MB Bank', 'Vietcombank', 'Viettinbank', 'Techcombank', 'Agribank', 'BIDV']
  listBank = <any>[]
  listTrans = <any>[]
  listData = []
  listTransactions = []
  id: number = 0;
  submitted: boolean
  // eventService: any;
  person = JSON.parse(localStorage.getItem('currentUser'));
  pageSize = 5
  pageIndex = 1


  pageSizelist = 10
  pageIndexlist = 1
  flag: number = 0

  totalElements = 2
  formData: FormGroup
  tableName: string = 'bankaccounts'
  // public person  
  constructor(
    private router: Router,
    private translateService: TranslateService,
    public eventService: EventService,
    private apiService: ApiService,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.id = this.activatedRoute.snapshot.params['id'];
    // console.log(this.person.token);
    this.getlistBank();
  }
  viewDetails(data: any) {
    this.router.navigate(['transactions/details-transactions', data.id]);
  }
  getlistBank(params = '') {

    params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList('bankaccounts'
      + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.listBank = res['bankaccounts'] ? res['bankaccounts'] : [];
        this.totalElements = res.length
        this.eventService.setLoading(false)
      }
    })
  }
  getlistTransaction(params = '') {
    params = '&order=updated_at&direction=desc'
    // this.eventService.setLoading(true)
    this.apiService.getList('transactions/' + 'get-by-bankaccount/' + (this.selectedId)
      + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.listTrans = res['transactions'] ? res['transactions'] : [];
        this.totalElements = res['pagination']['totalElements'] ? res['pagination']['totalElements'] : '';
      }
    })
  }
  selectedIndex: number = -1;
  selectedId: number | null = null;

  //get location
  // latitude: number;
  // longitude: number;

  // getLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         this.latitude = position.coords.latitude;
  //         this.longitude = position.coords.longitude;
  //       },
  //       (error) => {
  //         console.error('Error getting location:', error);
  //       }
  //     );
  //   } else {
  //     alert('Trình duyệt của bạn không hỗ trợ định vị địa lý.');
  //   }
  // }
  onRowClick(data: any, index: number) {
    this.selectedIndex = index;
    this.selectedId = data.id;
    this.getlistTransaction()
    this.flag = 1
  }
  get form() {
    return this.formData.controls
  }
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.id],
      // imei : [data.imei, [Validators.required]],
      // description: [data.description],
      // price: [data.price || 0, [Validators.required]],
      account_number: [data.account_number, [Validators.required]],
      // image_url: [data.image_url, [Validators.required]],
      bank_account_name: [data.bank_account_name, [Validators.required]],
      bank_name: [data.bank_name, [Validators.required]],
      // currency: [data.currency || 'VND'],
    })
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
        this.apiService.deleteItem(this.tableName, data).subscribe(res =>
          Swal.fire(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageDelete'), 'success')
            .then(
              res => {
                this.getlistBank();
              }
            )
        )
      }
    });
  }
  saveData() {
    this.submitted = true
    if (this.formData.valid) {
      const value = this.formData.value
      value['status'] = value['status'] == true ? 1 : 0
      this.eventService.setLoading(true)
      if (value.id) {
        this.apiService.editItem(this.tableName, value.id, value).subscribe({
          next: res => {
            this.submitted = false
            this.formData.reset()
            this.getlistBank();
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
            this.getlistBank();
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
