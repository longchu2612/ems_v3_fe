import { EventService } from './../../core/services/event.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
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
    totalCount = 2
    tableName = 'location'

    submitted: boolean
    formData: FormGroup

    breadCrumbItems

    get form() {
        return this.formData.controls
    }

    ngOnInit() {
        this.breadCrumbItems = [{ label: 'PAGE.HOME' }, { label: 'PAGE.REPORT.Location', active: true }];

        this.fetchData()
    }

    onChangePage(e) {
        this.pageIndex = e
        this.fetchData()
    }


    fetchData(params = '') {
        // let params =''
        // if(this.keyword){
        //     params ='&name='+this.keyword
        // }
        // if(this.selectedStation&& this.selectedStation.length >0){
        //     this.selectedStation.forEach(d => {
        //         params += `&station_id=${d}`
        //     })
        // }
        params = '&order=updated_at&direction=desc'
        this.eventService.setLoading(true)
        this.apiService.getList2(this.tableName + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`).subscribe({
            next: (res) => {
                this.listData = res.data
                this.totalCount = res.data.length
                // this.totalCount = res.meta.total
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
        this.formData = this.makeForm({ language: [] })
        let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
    }

    onEdit(data, content) {
        console.log(data)
        this.formData = this.makeForm(data)
        // this.uploadedImage = data.media.url
        this.modalService.open(content, { centered: true, scrollable: true, size: 'xl' });
    }

    // selectedIncident = null
    selectedKeyword = null

    makeFormKeyword(d) {
        let data = d ? d : <any>{}
        return this.formBuilder.group({
            id: [data.id],
            name: [data.name],
            // incident_type_id: [data.incident_type_id]
        })
    }


    defaultPrices = [
        { condition: 1, price: 0, unit: '' },
        { condition: 2, price: 0, unit: '' }
    ]

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
            language: this.makePrices(data.language || []),
            lat: [data.lat],
            long: [data.long],
            description: [data.description],
            // price: [data.price || 0, [Validators.required]],
            // prices: this.makePrices(data.prices || this.defaultPrices),
            // status: [data.status || false],
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

    // handleFileInput(fileInput) {
    //     // console.log(fileInput)
    //     let file = fileInput.target.files[0]
    //     const formData: FormData = new FormData();
    //     formData.append('file', file);
    //     this.uploadedImage = null
    //     this.apiService.uploadImage(formData).pipe(map(v => v['data'])).subscribe(v => {
    //         if (v) {
    //             // console.log(v)
    //             let url = v['url'];
    //             this.uploadedImage = url
    //             this.form['media_id'].patchValue(v['id'])
    //         }
    //     })


    // }

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
