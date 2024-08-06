import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { AuthfakeauthenticationService } from 'src/app/core/services/authfake.service';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {


  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();
  isChecked: boolean = false;
  @ViewChild('usernameInput') usernameInput: ElementRef | undefined;
  @ViewChild('passwordInput') passwordInput: ElementRef | undefined;
  tableName: string = 'workspaces';
  fullName = <any>[];
  idWs: number;
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  data = <any>{};
  listData = <any>[];
  // tslint:disable-next-line: max-line-length
  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private apiService: ApiService,
    private translateService: TranslateService,
    public authenticationService: AuthenticationService,
    public authFackservice: AuthfakeauthenticationService,
    private modalService: NgbModal,

  ) {
    const storedValue = localStorage.getItem('rememberMe');
    if (storedValue) {
      this.isChecked = JSON.parse(storedValue);
      if (this.isChecked) {
        const storedCredentials = localStorage.getItem('credentials');
        // if (storedCredentials) {
        //     const { username, password } = JSON.parse(storedCredentials);
        //     if (this.usernameInput && this.passwordInput) {
        //         this.usernameInput.nativeElement.value = username;
        //         this.passwordInput.nativeElement.value = password;
        //     }
        // }
      }
    }
  }

  ngOnInit() {
    this.fetchData();
    document.body.removeAttribute('data-layout');
    document.body.classList.add('auth-body-bg');
    //   this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
  onCheckboxChange(event: Event) {
    this.isChecked = (event.target as HTMLInputElement).checked;
    localStorage.setItem('rememberMe', JSON.stringify(this.isChecked));

    if (this.isChecked) {
      const username = this.f.username.value;
      const password = this.f.password.value;
      localStorage.setItem('credentials', JSON.stringify({ username, password }));
    } else {
      localStorage.removeItem('credentials');
    }
  }
  filter = {
    name: ''
  }
  searching = false

  params = ''
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
      this.fetchData()
    }
  }
  selected: any;

  clearFilter() {
    this.selected = ''
    this.params = ''
    this.filter.name = ''
    this.pageIndex = 1
    this.searching = false
    this.fetchData()
  }
  fetchData() {
    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + `?page=${this.pageIndex}&limit=${this.pageSize}${this.params}`
    ).subscribe({
      next: (res) => {
        // this.data = res
        // console.log(res);
        
        this.listData = res['workspaces'] ? res['workspaces'] : [];
        // this.fullName = res['workspaces']['leader'] ? res['workspaces']['leader'] : '';
        // console.log(this.fullName);

        // this.idWs = this.listData[2].id
        // this.idWs = this.listData['id'] ? this.listData['id'] : '';
        console.log(this.listData)
        this.eventService.setLoading(false)
      }
    })
  }

  // form
  formData: FormGroup
  openModal(content: any) {
    // this.apiService.successmsg()
    this.submitted = false
    this.formData = this.makeForm()
    this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
  }
  get form() {
    return this.formData.controls
  }
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.id],
      name: [data.name, [Validators.required]],

    })
  }
  saveData() {
    this.submitted = true
    if (this.formData.valid) {
      const value = this.formData.value
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
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.username.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        const data = this.loginForm.value
        // console.log(data)
        this.authFackservice.login(this.f.username.value, this.f.password.value, this.f.rememberMe.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }
  getFirstCharactersOfWords(name: string): string {
    const words = name.split(' ');
    const firstChars = words.map(word => word.charAt(0)); 
    return firstChars.join(''); 
  }

  getFirstLetters(): string {
    return this.getFirstCharactersOfWords(this.fullName);
  }
  showId(index: any) {
    localStorage.setItem('workspace', index.id);
    localStorage.setItem('workSpace1', index.name);
    localStorage.setItem('workSpaceCode', index.code);
    this.router.navigate(['/']);
  }
  // chooseWorkspace(id){
  //   // this.eventService.setLoading(true)
  //   this.apiService.chooseWorkspace(id
  //   ).subscribe({
  //     next: (res) => {
  //       console.log(res)
  //       this.listData = res
  //       this.router.navigate(['/']);
  //     }
  //   })
  // }
  logout() {
    if (environment.defaultauth === 'firebase') {
      this.authService.logout();
    } else {
      this.authFackservice.logout();
      this.router.navigate(['/account/login']);
      localStorage.removeItem('workspace');
      localStorage.removeItem('workSpaceCode');
      localStorage.removeItem('workSpace1');}
  }
}
