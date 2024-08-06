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
  selector: 'app-split-orders',
  templateUrl: './split-orders.component.html',
  styleUrls: ['./split-orders.component.scss']
})
export class SplitOrdersComponent implements OnInit {



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
  totalPendingPrice = 0
  totalPendingQuantity = 0
  orderId = ''
  pending: boolean = true
  done: boolean = false
  status: number
  id
  selectedStatus: number = 1;
  user
  tableName = ''
  flag_next: boolean = false
  ngOnInit() {
    // this.id = localStorage.getItem('orderId')
    this.id = this.activatedRoute.snapshot.params['id'];
    this.orderId = localStorage.getItem('orderId')

    // this.name = JSON.parse(localStorage.getItem('user')).name
    this.user = localStorage.getItem('user')
    console.log(this.user)
    this.fetchList(0)
  }
  getproducts() {
    this.listData = JSON.parse(sessionStorage.getItem('orderDetails'))
  }
  // toDone(dataIndex) {
  //   const data = {
  //   }
  //   this.eventService.setLoading(true)
  //   this.apiService.editItem('order-detail/served', dataIndex.id, data
  //   ).subscribe({
  //     next: res => {
  //       this.eventService.setLoading(false)
  //       this.fetchList(3)
  //     }
  //   })
  // }
  fetchList(statusID: number = 0) {
    this.selectedStatus = statusID;
    this.totalPendingPrice = 0
    this.totalPendingQuantity = 0
    this.apiService.getListData('orders/detail/' + this.orderId + `?status=${statusID}`).subscribe({
      next: res => {
        const data = res['orderDetails']
        this.status = res['status']
        this.name = res['customerName']
        this.tableName = res['tableName']
        sessionStorage.setItem('orderDetails', JSON.stringify(data))
        this.getproducts()
      }
    })
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
        // this.fetchList(0)
        this.router.navigate(['/return-food'])

      }, err => {
        this.showErrorAlert()
        console.log(err)
      })
  }
  toCart() {
    this.router.navigate(['cart'])
  }
  Pays() {

    this.router.navigate(['bill-manager/details-bill/', this.id])
  }
  makeForm(d?) {
    let data = d ? d : <any>{}
    return this.formBuilder.group({
      id: [data.userId],
    //   phone: [data.phone, [Validators.required, Validators.pattern('^(84|0[3|5|7|8|9])+([0-9]{8})$')]],
    //   email: [data.email, [Validators.required, Validators.email]],
    //   tableName: [data.tableName, [Validators.required]],
      customerName: [data.customerName, [Validators.required]],
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
        const value = {
          customerName : this.formData.value.customerName,
          orderDetails : this.listData

        }
        this.eventService.setLoading(true)
            this.apiService.addItem('orders/split/' + this.orderId, value).subscribe({
                next: res => {
                    this.apiService.showToast('', 'Tách  đơn thành công', 'success')
                    this.eventService.setLoading(false)
                    this.modalService.dismissAll()
                      this.fetchList(0)

                },
                error: e => {
                    this.apiService.showToast('Lỗi', 'Có lỗi xảy ra', 'error')
                    this.eventService.setLoading(false)
                }
            })
    } else {
        console.log('invalid', this.formData)
        this.apiService.showToast('Lỗi', 'Chưa nhập tên khách', 'error')
        Object.values(this.formData.controls).forEach(control => {
            if (control.status == 'INVALID') {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            }
        });
    }
}
  filterStatus(status) {
    this.pending = false
    this.done = false
    this.flag_next = false
    if (status == 1) {
      this.pending = true
    }
    // if (status == 0) {
    //     this.done = true
    // }
    if (status == 3) {
      this.flag_next = true
    }

    this.fetchList(status)
  }
  updateOrder() {
    let order = JSON.parse(sessionStorage.getItem('orderDetails'))
    const data = {
      'orderDetails': order
    }
    this.apiService.editItem('orders/update/', this.orderId, data).subscribe({
      next: res => {
        this.showSuccessAlert()
        console.log(res);
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
