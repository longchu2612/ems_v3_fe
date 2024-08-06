import { ApiService } from 'src/app/shared/services/api.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { throttleTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-details-bill',
  templateUrl: './details-bill.component.html',
  styleUrls: ['./details-bill.component.scss']
})
export class DetailsBillComponent implements OnInit {

    constructor(
      private apiService: ApiService,
      private eventService: EventService,
      public activatedRoute: ActivatedRoute,
      private router: Router,
      public formBuilder: FormBuilder,
      private modalService: NgbModal,        
      public translateService: TranslateService

  ) { }
  
  @ViewChild('input') input: ElementRef;
  submitted: boolean
  formData: FormGroup
  get form() {
    return this.formData.controls
  }

  listData = [
  ]
  name
  _data = []
  totalPrice = 0
  totalQuantity = 0
  orderId = ''
  pending: boolean = false
  done: boolean = false
  status: number
  id
  selectedStatus: number = 0;
  user
  tableName = ''
  flag_next: boolean = false
  listOrdersId = <any>[]
  ngOnInit() {

    this.id = this.activatedRoute.snapshot.params['id'];
      this.name = JSON.parse(localStorage.getItem('user')).fullName
      this.orderId = localStorage.getItem('orderId')
      console.log(this.orderId);
      
      this.fetchList(0)
      this.caculateTotal()
  }
  getproducts() {
      this.listData = JSON.parse(sessionStorage.getItem('orderDetails'))
  }
  toDone(dataIndex) {
      const data = {
      }
      this.eventService.setLoading(true)
      this.apiService.editItem('order-detail/served', dataIndex.id, data
      ).subscribe({
          next: res => {
              this.eventService.setLoading(false)
              this.fetchList(3)
          }
      })
  } 
 
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.userId],
    //   phone: [data.phone, [Validators.required, Validators.pattern('^(84|0[3|5|7|8|9])+([0-9]{8})$')]],
    //   email: [data.email, [Validators.required, Validators.email]],
    //   tableName: [data.tableName, [Validators.required]],
      orderId: [data.orderId, [Validators.required]],
    })
  }
  openModal(content: any) {
    this.submitted = false
    this.formData = this.makeForm()
    let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'xs' });
  }
  saveData() {
    this.submitted = true
    if (this.formData.valid) {
        const value = this.formData.value
        this.eventService.setLoading(true)
            this.apiService.addItem('orders/merge/' + this.orderId, value).subscribe({
                next: res => {
                    this.apiService.showToast('', 'Ghép đơn thành công', 'success')
                    this.eventService.setLoading(false)
                    this.modalService.dismissAll()
                      this.fetchList(0)

                },
                error: e => {
                    this.apiService.showToast('Lỗi', 'Thiếu mã đơn hàng', 'error')
                    this.eventService.setLoading(false)
                }
            })
    } else {
        console.log('invalid', this.formData)
        this.apiService.showToast('Lỗi', 'Thiếu mã đơn hàng', 'error')
        this.eventService.setLoading(false)
        Object.values(this.formData.controls).forEach(control => {
            if (control.status == 'INVALID') {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            }
        });
    }
}
  fetchList(statusID: number = 0) {
      this.selectedStatus = statusID;

      this.apiService.getListData('orders/detail/' + this.id + `?status=${statusID}`).subscribe({
          next: res => {
              const data = res['orderDetails']
              this.status = res['status']
              this.name = res['customerName']
              this.tableName = res['tableName']
              // if (this.status == 1){
              sessionStorage.setItem('orderDetails', JSON.stringify(data))
              // this.tabs[0].count = res.length
              // this.tabs.map((item, index) => {
              //     if(index == 0){
              //         item.count = res.length
              //     }else{
              //         item.count = res.filter(i => i.category == index).length
              //     }
              //     return item
              // })
              // this.selectedList = [...this.listOrders]
  
              // this.totalCount = res.length()
  
              this.getproducts()
               this.caculateTotal()
        }
      })
  }
  caculateTotal() {
    this.totalPrice = 0;
    this.totalQuantity = 0;

    for (let item of this.listData) {
      this.totalPrice += item.price * item.quantity;
      this.totalQuantity += item.quantity;
    }
  }
  addNeworder() {
  
      const data = {
          'orderDetails': this.listData
      }
      this.apiService.editItem('orders/process', this.id, data).pipe().subscribe(
          (res) => {
              console.log(res);
              this.showSuccessAlert()
              sessionStorage.removeItem('selectedProducts');
              // window.location.reload()
              this.fetchList(0)
  
          }, err => {
              this.showErrorAlert()
              console.log(err)
          })
  }
  toCart() {
      this.router.navigate(['cart'])
  }
  Pays() {
  
      const data = {
          'orderDetails': this.listData
      }
      this.apiService.editItem('orders/complete', this.id, data).pipe().subscribe(
          (res) => {
              console.log(res);
              this.showSuccessAlert()
              sessionStorage.removeItem('selectedProducts');
              localStorage.removeItem('orderId');
              // window.location.reload()
              this.router.navigate(['serve'])
          }, err => {
              this.showErrorAlert()
              console.log(err)
          })
  }
  filterStatus(status) {
      this.pending = false
      this.done = false
      this.flag_next = false
      if (status == 1) {
          this.pending = true
      }
      if (status == 0) {
          this.done = true
      } if (status == 3) {
          this.flag_next = true
      }
  
      this.fetchList(status)
  }
  updateOrder() {
      let order = JSON.parse(sessionStorage.getItem('orderDetails'))
      const data = {
        'orderDetails': order.map(orderItem => ({ ...orderItem, name: orderItem.productName }))
    };
    
      this.apiService.editItem('orders/update', this.id, data).subscribe({
          next: res => {
              this.showSuccessAlert()
              console.log(res);
              this.router.navigate(['serve'])

          }, error: e => {
              this.showErrorAlert()
          }
      })
  }
  increaseQuantity(productId: string) {
      const storedData = JSON.parse(sessionStorage.getItem('orderDetails'));
      if (storedData) {
          // Tìm sản phẩm trong mảng `storedData` dựa trên `productId`
          const productIndex = storedData.findIndex((item: any) => item.id === productId);
          if (productIndex !== -1) {
              // Tăng số lượng sản phẩm
              storedData[productIndex].quantity++;
              // Cập nhật lại sessionStorage
              sessionStorage.setItem('orderDetails', JSON.stringify(storedData));
          }
      }
    this.caculateTotal()
    this.getproducts()
  }
  decreaseQuantity(productId: string) {
      const storedData = JSON.parse(sessionStorage.getItem('orderDetails'));
      if (storedData) {
          // Tìm sản phẩm trong mảng `storedData` dựa trên `productId`
          const productIndex = storedData.findIndex((item: any) => item.id === productId);
          if (productIndex !== -1) {
              // Giảm số lượng sản phẩm
              if (storedData[productIndex].quantity > 1) {
                  storedData[productIndex].quantity--;
                  // Cập nhật lại sessionStorage
                  sessionStorage.setItem('orderDetails', JSON.stringify(storedData));
              }
          }
      }
    this.caculateTotal()
    this.getproducts()
  }
  showConfirmDeleteDialog = false;
  
  deleteProduct(productId: string) {
      const storedData = JSON.parse(sessionStorage.getItem('orderDetails'));
      if (storedData) {
          const updatedData = storedData.filter((item: any) => item.id !== productId);
          sessionStorage.setItem('orderDetails', JSON.stringify(updatedData));
      }
      this.getproducts()
      this.caculateTotal()
    }
  
  showSuccessAlert() {
      swal.fire({
          icon: 'success',
          text: 'Thành công!',
          // text: 'Your order has been placed successfully. Thank you!',
          width: 300, // Điều chỉnh chiều rộng
          padding: '1rem', // Điều chỉnh padding
          confirmButtonColor: '#28a745' // Màu xanh cho nút OK
      });
  }
  showErrorAlert() {
      swal.fire({
          icon: 'error',
          title: 'Thất bại!',
          // text: 'An error occurred while placing your order. Please try again later.',
          width: 300, // Điều chỉnh chiều rộng
          padding: '1rem', // Điều chỉnh padding
          confirmButtonColor: '#dc3545' // Màu đỏ cho nút OK
      });
  }
  
  
  }