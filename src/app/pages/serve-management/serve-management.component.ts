import { ApiService } from 'src/app/shared/services/api.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { throttleTime } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-serve-management',
    templateUrl: './serve-management.component.html',
    styleUrls: ['./serve-management.component.scss']
})
export class ServeManagementComponent implements OnInit {

    constructor(
        private apiService: ApiService,
        private eventService: EventService,
        public activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private router: Router,
        public formBuilder: FormBuilder,
    ) { }

    @ViewChild('input') input: ElementRef;
    submitted: boolean

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
    formData: FormGroup
    get form() {
      return this.formData.controls
    }
  
    ngOnInit() {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.user = localStorage.getItem('user')
        console.log(this.user)
        this.fetchList(1)
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
    fetchList(statusID: number = 1) {
        this.selectedStatus = statusID;
        this.totalPendingPrice = 0
        this.totalPendingQuantity = 0
        this.apiService.getListData('orders/detail/' + this.id + `?status=${statusID}`).subscribe({
            next: res => {
                const data = res['orderDetails']
                this.totalPrice = res['totalPrice']
                this.totalQuantity = res['totalQuantity']
                this.status = res['status']
                this.name = res['customerName']
                this.tableName = res['tableName']
                for (let i = 0; i < data.length; i++) {
                    if(data[i].pending > 0){
                        this.totalPendingPrice += data[i].price * data[i].pending
                        this.totalPendingQuantity += data[i].pending
                    }
                }
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
            }
        })
    }
    makeForm(d?) {
        let data = d ? d : <any>{}
        return this.formBuilder.group({
          id: [data.userId],
          phone: [data.phone, [Validators.required, Validators.pattern('^(84|0[3|5|7|8|9])+([0-9]{8})$')]],
          userName: [data.userName, [Validators.required]],
          email: [data.email, [Validators.required, Validators.email]],
          // price: [data.price || 0, [Validators.required]],
          fullName: [data.fullName, [Validators.required]],
          // image_url: [data.image_url, [Validators.required]],
          // password: [data.password, [Validators.required]],
          roleId: [data.roleId, [Validators.required]],
          // roleId: [parseInt(data.roleId), [Validators.required]],
        })
      }
    addNeworder() {
        console.log(this.listData.length)
        if(this.listData.length ==0) {
                this.showErrorAlertOrders()
        } else {
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
      
    }
    toCart() {
        this.router.navigate(['cart'])
    }
    Pays() {

      this.router.navigate(['bill-manager/details-bill/', this.id])
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
                storedData[productIndex].pending++;
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
                if (storedData[productIndex].pending > 1) {
                    storedData[productIndex].pending--;
                    // Cập nhật lại sessionStorage
                    sessionStorage.setItem('orderDetails', JSON.stringify(storedData));
                }
            }
        }
        this.getproducts()
    }
    openModal(content: any) {
        this.submitted = false
        this.formData = this.makeForm()
        let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'xs' });
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
    showErrorAlertOrders() {
        swal.fire({
            icon: 'error',
            title: 'Đơn hàng trống!',
            // text: 'An error occurred while placing your order. Please try again later.',
            width: 300, // Điều chỉnh chiều rộng
            padding: '1rem', // Điều chỉnh padding
            confirmButtonColor: '#dc3545' // Màu đỏ cho nút OK
        });
    }
    saveData(){

    }
}
