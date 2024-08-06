import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})

export class OrdersDetailComponent implements OnInit {

  position = ''
  listData
  id: number = 0;
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  listProducts
  totalPrice = 0
  totalQuantity = 0
  noteOrder = ''
  name : string = ''
  cashierName = ''
  tableName = ''
  customerPays = 0
  listStatus = [{
    id : 5 , name : 'Tiền mặt'
  },
  {
    id : 6 , name : 'Chuyển khoan'
  }
]
  orderId = ''
  createdAt = ''
  currentDate: Date;
  formattedDate: string;
  constructor(
    public eventService: EventService,
    private apiService: ApiService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
  ) { 
    this.currentDate = new Date();
    // this.formattedDate = format(this.currentDate, 'dd/MM/yyyy HH:mm:ss');
  }

  ngOnInit(): void {
    console.log(this.currentDate);
    
    this.id = this.activatedRoute.snapshot.params['id'];
    this.cashierName = JSON.parse(localStorage.getItem('currentUser')).fullName
    this.fetchData();
  }
  getlistProducts() {
    const data = {}
    this.apiService.getListpost('products/list', data
    ).subscribe({
      next: (res) => {
        this.listProducts = res['content'] ? res['content'] : [];
      }
    })
  }
  fetchData() {
    this.apiService.getList('orders/detail/' + this.id
    ).subscribe({
      next: (res) => {
        this.listData = res['orderDetails'] ? res['orderDetails'] : []
        this.name = res['customerName']
        this.totalPrice = res['totalPrice'] ? res['totalPrice'] : 0
        this.totalQuantity = res['totalQuantity'] ? res['totalQuantity'] : 0
        this.noteOrder = res['note']
        this.orderId = res['id']
        this.tableName = res['tableName']
        this.createdAt = res['createdAt']
      }
    })
  }
  onDelete(id) {
    console.log(id);

  }
  Complete() {
    const data = {
      

    }
    this.eventService.setLoading(true)
    this.apiService.editItem('orders/close', this.id, data
    ).subscribe({
      next: res => {
        this.eventService.setLoading(false)
        this.router.navigate(['ordersmanagement'])

      }
    })
  }
  decreaseQuantity(id) { }
  increaseQuantity(id) { }
}
