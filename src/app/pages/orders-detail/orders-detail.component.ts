import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Directive, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
  showButtons: boolean = true;
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
  Status : number = 5 
  customerPays = 0
  nameShop = ''
  addressShop = ''
  phoneShop = ''
  listStatus = [{
    id : 6 , name : 'Tiền mặt'
  },
  {
    id : 5 , name : 'Chuyển khoản'
  }
]
  orderId = ''
  createdAt = ''
  currentDate: Date;
  formattedDate: string;  
  fileName: string;

  constructor(
    private http: HttpClient,
    public eventService: EventService,
    private apiService: ApiService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public formBuilder: FormBuilder,
    private el: ElementRef, 
  ) { 
    this.currentDate = new Date();
  }
 
  ngOnInit(): void {
    this.getInfoShop()
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
  reloadData(){
    window.location.reload()
  }
  exportPDF() {
    this.showButtons = false;
    const element = document.getElementById('pdfContent'); 
    const opt = {
      margin:       0.1,
      filename:     'hoa-don-thanh-toan.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Chuyển đổi HTML thành PDF
    html2pdf().from(element).set(opt).save();
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
  validateInput(event: any) {
    const input = event.target.value;
    
    const sanitizedValue = input.replace(/[^0-9]/g, '');
  
    if (sanitizedValue !== input) {
      event.target.value = sanitizedValue;
    }
    this.customerPays = parseInt(sanitizedValue);
  }
  // exportExcel(){
  //   this.apiService.getList('orders/export/' + this.id 
  // ).subscribe({
  //   next: (res) => {
  //     console.log(res);
      
  //   }
  // })
  // }
  exportExcel() {
    this.http.get('orders/export/' + this.id + `?customer_name=${this.name}&status=${this.Status}`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders.xlsx');
        document.body.appendChild(link);
        link.click();
      });
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
      "customerName": this.name,
      "status" : this.Status

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

