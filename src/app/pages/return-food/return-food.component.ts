import { ApiService } from 'src/app/shared/services/api.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-return-food',
  templateUrl: './return-food.component.html',
  styleUrls: ['./return-food.component.scss']
})
export class ReturnFoodComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private eventService: EventService,
    public activatedRoute: ActivatedRoute,
    private router: Router,

) { }

@ViewChild('input') input: ElementRef;

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
selectedStatus: number = 3;
user
tableName = ''
flag_next: boolean = false
ngOnInit() {
    this.id = localStorage.getItem('orderId')
    // this.name = JSON.parse(localStorage.getItem('user')).name
    this.user = localStorage.getItem('user')
    console.log(this.user)
    this.fetchList(3)
}
reloadData(){
    this.fetchList(1)
}
getproducts() {
    this.listData = JSON.parse(sessionStorage.getItem('orderDetails'))
}
 toDone(dataIndex){
    const data = {
        "quantity": 1,
    }
    console.log(dataIndex)
    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/served' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchList(3)
        this.eventService.setLoading(false)
      }
    })
  }
  toDoneAll(dataIndex){
    const data = {
        "quantity": dataIndex.serving,
    }
    console.log(dataIndex)
    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/served' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchList(3)
        this.eventService.setLoading(false)
      }
    })
  }
  toPending(dataIndex){
    const data = {
        "quantity":1
    }

    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/un-serve' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchList(4)
        this.eventService.setLoading(false)
      }
    })
  }
  toPendingAll(dataIndex){
    const data = {
        "quantity":dataIndex.done
    }
    console.log(data)
    this.eventService.setLoading(true)
    this.apiService.editItem('order-detail/un-serve' , dataIndex.id, data
    ).subscribe({
      next: res => {
        this.fetchList(4)
        this.eventService.setLoading(false)
      }
    })
  }
fetchList(statusID: number = 3) {
    this.selectedStatus = statusID;
    const data = {
      status : statusID
    }
   
    this.apiService.getListpost('order-detail/list' , data).subscribe({
        next: res => {
            this.listData = res['content']
            this.totalPrice = res['totalPrice']
            this.totalQuantity = res['totalQuantity']
            this.status = res['status']
            this.name = res['customerName']
            this.tableName = res['tableName']

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
    if (status == 3) {
        this.pending = true
    }
    // if (status == 0) {
    //     this.done = true
    // } if (status == 3) {
    //     this.flag_next = true
    // }

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
