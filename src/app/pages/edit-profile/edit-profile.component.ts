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
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  fullName: string = '';
  lastName: string = '';
  address: string = '';
  city: string = '';
  email: string = '';
  phoneNumber: string = '';
  bio: string = '';
  errorMessage: string = '';
  data
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

  logFormValues() {
    const data = {
      fullName: this.fullName ? this.fullName : this.data.fullName,
      address: this.address ? this.address : this.data.address,
      email: this.email ? this.email : this.data.email,
      phone: this.phoneNumber ? this.phoneNumber : this.data.phone,
      bio: this.bio
    }
    this.apiService.editItem('users/update' , '' ,  data
    ).subscribe({
      next: res => {
        this.data = res ? res : {};
        console.log(this.data);
        this.fetchData()

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
  fetchData() {
    this.eventService.setLoading(true)
    this.apiService.getList('users/detail'
    ).subscribe({
      next: res => {
        this.data = res ? res : {};
        console.log(this.data);
        this.eventService.setLoading(false)
      }
    })
  }
  logout() {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFackservice.logout();

    }
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/account/login']);
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

        this.apiService.addItem('users/change-password', value).subscribe({
          next: res => {
            this.eventService.setLoading(false)
            this.modalService.dismissAll()
            this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessageAdd'), 'success')
            this.logout()
          },
          error: e => {
            // this.errorMessage = e.error.message;
            this.apiService.showToast(this.translateService.instant('FORM.Error'), this.translateService.instant('FORM.ErrorMessageAdd'), 'error')
            this.eventService.setLoading(false)
            this.logout()
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
