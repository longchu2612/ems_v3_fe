import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'leaflet';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-shop-manager',
  templateUrl: './shop-manager.component.html',
  styleUrls: ['./shop-manager.component.scss']
})
export class ShopManagerComponent implements OnInit  {

  name: string = '';
  address: string = '';
  city: string = '';
  email: string = '';
  phone: string = '';
  taxNo: string = '';
  errorMessage: string = '';
  listData = <any>{}
  constructor(
    private router: Router,
    private apiService: ApiService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public formBuilder: FormBuilder,
    private eventService: EventService,
    private translateService: TranslateService
  ) { }
  formData: FormGroup

  ngOnInit(): void {
    this.fetchData()
  }

  configShop() {
    const data = {
      name: this.name ? this.name : this.listData.name,
      address: this.address ? this.address : this.listData.address,
      phone: this.phone ? this.phone : this.listData.phone,
      taxNo: this.taxNo ? this.taxNo : this.listData.taxNo
    }
    this.eventService.setLoading(true)

    this.apiService.editItem('eateries/update' , '3M072957', data).subscribe({
      next: res => {
        this.eventService.setLoading(false)
        this.modalService.dismissAll()
        this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageAdd'), 'success')
        this.fetchData()

      },
      error: e => {
        // this.errorMessage = e.error.message;
        this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessageAdd'), 'error')
        this.eventService.setLoading(false)
      }
    })  }
  fetchData() {
    this.eventService.setLoading(true)
    this.apiService.getList(`eateries/detail/3M072957`).subscribe({
      next: (res) => {
        this.eventService.setLoading(false)
        this.listData = res;
      }
    })
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const newPasswordControl = formGroup.get('newPassword');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (newPasswordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator 
    })
  }
  resetPassword(){
    
  }
  openModal(content: any) {
    this.formData = this.makeForm()
    let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
  }
  saveData() {
    if (this.formData.valid) {
      const value = this.formData.value
      this.eventService.setLoading(true)

        this.apiService.addItem('eateries/detail/3M072957', value).subscribe({
          next: res => {
            this.eventService.setLoading(false)
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageAdd'), 'success')
          },
          error: e => {
            // this.errorMessage = e.error.message;
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessageAdd'), 'error')
            this.eventService.setLoading(false)
          }
        })

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
