import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ViewChild, ElementRef } from '@angular/core';

interface DataTest {
  full_name: string
}

@Component({
  selector: 'app-details-transactions',
  templateUrl: './details-transactions.component.html',
  styleUrls: ['./details-transactions.component.scss']
})
export class DetailsTransactionsComponent implements OnInit {
  position = ''
  listData
  id: number = 0; 
  orderId = ''
  listStatus = [{
    id : 6 , name : 'Tiền mặt'
  },
  {
    id : 5 , name : 'Chuyển khoản'
  }
]
  createdAt = ''
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
  Status : number = 0 
  customerPays = 0
  nameShop = ''
  addressShop = ''
  phoneShop = ''
  constructor(
    public eventService: EventService,
    private apiService: ApiService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.getlistProducts()
    this.getInfoShop()
    this.fetchData();
  }
  getInfoShop() {
    this.apiService.getList('eateries/detail/3M072957' 
    ).subscribe({
      next: (res) => {
        this.phoneShop = res['phone'] ? res['phone'] : ''
        this.nameShop = res['name']
        this.addressShop = res['address'] ? res['address'] : ''
       
      }
    })
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
    // params = '&order=updated_at&direction=desc'
    this.apiService.getList('orders/detail/' + this.id
      // + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.listData = res['orderDetails'] ? res['orderDetails'] : []
        this.position = res['position']
        this.name = res['customerName']
        this.totalPrice = res['totalPrice'] ? res['totalPrice'] : 0
        this.totalQuantity = res['totalQuantity'] ? res['totalQuantity'] : 0
        this.noteOrder = res['note']
        this.orderId = res['id']
        this.Status = res['status']
        this.tableName = res['tableName']
        this.cashierName = res['cashierName']
        this.createdAt = res['createdAt']
        // // this.totalElements = res.meta.total
      }
    })
  }
  onDelete(id) {
    console.log(id);

  }
  decreaseQuantity(id) { }
  increaseQuantity(id) { }
}
