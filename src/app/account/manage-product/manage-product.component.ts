import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

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
      listData = []
      pageSize = 10
      pageIndex = 1
      totalElements = 2
      tableName = 'products'
      role = JSON.parse(localStorage.getItem('currentUser'))['role']
      submitted: boolean
      formData: FormGroup
      listModel = []
      listStatus = [{
        id : 0 , name  :'Ngừng kinh doanh'
      },
      {
        id : 1 , name  :'Đang kinh doanh'
      }]
      listVersion = ['Paybox', 'Soundbox']
      // listStatus = ['Trực tuyến' , 'Ngoại tuyến']
      breadCrumbItems
      imageUrl: string = ''
      get form() {
        return this.formData.controls
      }

      ngOnInit() {
        this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.IncidentType', active: true }];
        this.fetchData()
        this.getIdcategory()
      }
      getIdcategory() {
        const data = {}
        this.apiService.getListpost(`categories/list`, data).subscribe({
          next: (res) => {
            this.listModel = res['content'] ? res['content'] : [];
            console.log(this.listModel);

          }
        })
      }
      onFileSelected(event) {
        const file: File = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        this.apiService.uploadImage(formData).subscribe(response => {
          console.log(response['fileUrl']);
          this.imageUrl =  response['fileUrl']
        }, error => {
          console.error('Upload error:', error);
        });
      }

      // uploadImage(file: File) {
      //   const formData = new FormData();
      //   formData.append('file', file);
      //   this.apiService.uploadImage(formData).subscribe(response => {
      //     console.log(response['fileUrl']);

      //   }, error => {
      //     console.error('Upload error:', error);
      //   });
      // }
      onChangePage(e) {
        this.pageIndex = e
        this.fetchData()
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
          this.fetchData()
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
        this.fetchData()
      }

      fetchData() {
        const data = {
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize,
          "name": this.filter.name,
        }
        this.eventService.setLoading(true)
        this.apiService.getListpost(this.tableName + `/list`, data).subscribe({
          next: (res) => {
            this.eventService.setLoading(false)
            this.listData = res['content'] ? res['content'] : [];
            this.totalElements = res['totalElements'] ? res['totalElements'] : '';
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
        this.submitted = false
        this.formData = this.makeForm({ language: [{}] })
        let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
      }
      categoryName = ''
      onDetailB(data, contentDetail) {
        this.formData = this.makeForm(data)
        this.modalService.open(contentDetail, { centered: true, scrollable: true, size: 'lg' });
        if (data.id) {
          this.apiService.getList(this.tableName + `/detail/${data.id}`).subscribe({
            next: res => {
              this.categoryName = res['categoryName'] ? res['categoryName'] : ''
            },
          })
        }

      }

      onEdit(data, content) {
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



      makeForm(d?) {
        let data = d ? d : <any>{}
        return this.formBuilder.group({
          id: [data.id],
          name: [data.name, [Validators.required]],
          categoryId: [data.categoryId, [Validators.required]],
          price: [data.price, [Validators.required]],
          status: [data.status],
          image: [data.image ,[Validators.required]]
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
          value['status'] = value['status'] == true ? 1 : 0
          // value['prices'][0]['condition'] = 1
          // value['prices'][1]['condition'] = 2
          // value['price']= value['prices']
          this.eventService.setLoading(true)
          if (value.id) {
            this.apiService.editItem(this.tableName + `/update`, value.id, value).subscribe({
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
            this.apiService.addItem(this.tableName + `/add`, value).subscribe({
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
      goToPreviousPage() {
        if (this.pageIndex > 1) {
          this.pageIndex--;
          this.fetchData();
        }
      }

      goToNextPage() {
        if (this.pageIndex < this.totalElements) {
          this.pageIndex++;
          this.fetchData();
        }
      }

}
