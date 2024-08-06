import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-detail-create-order',
  templateUrl: './detail-create-order.component.html',
  styleUrls: ['./detail-create-order.component.scss']
})
export class DetailCreateOrderComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    public router: Router,
    public formBuilder: FormBuilder,
    private eventService: EventService,
    private translateService: TranslateService
  ) { }

  hidden: boolean = true
  searchTerm
  listData = []
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  // tableName = 'customers'
  formData: FormGroup
  submitted: boolean

  ngOnInit(): void {
  }

  get form() {
    return this.formData.controls
  }

}
