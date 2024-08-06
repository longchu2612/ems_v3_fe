import { ApiService } from 'src/app/shared/services/api.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.scss']
})
export class CartpageComponent implements OnInit {

  constructor(
    private router: Router,
    private apiService: ApiService
) { }

@ViewChild('input') input: ElementRef;

listData = [
   
]
id
name = localStorage.getItem('name');
_data = []
totalPrice = 0
totalQuantity = 0
orderId = ''
pending: boolean = false
status: number
ngOnInit() {
    this.orderId = localStorage.getItem('orderId')
    this.getProduct()
    this.caculateTotal()
    this.getproducts()
}
getproducts() {
    this.listData = JSON.parse(sessionStorage.getItem('cartOrders'))
}
getProduct() {
    const storedData = JSON.parse(sessionStorage.getItem('cartOrders'));

    // Kiểm tra nếu dữ liệu tồn tại
    if (storedData) {
      // Đổi tên trường từ "id" thành "productId"
      this.listData = storedData.map((item: any) => {
        return {
          ...item,
          productId: item.id
        };
      });

    }
  }
  caculateTotal() {
    this.totalPrice = 0;
    this.totalQuantity = 0;

    for (let item of this.listData) {
      this.totalPrice += item.price * item.quantity;
      this.totalQuantity += item.quantity;
    }
  }
  fetchList(statusID: number = 0) {

    const data = {
        tableId: this.id
    }
    this.apiService.getListData('orders/detail/' + this.id + `?status=${statusID}`).subscribe({
        next: res => {
            const data = res['orderDetails']
            this.totalPrice = res['totalPrice']
            this.totalQuantity = res['totalQuantity']
            this.status = res['status']
            this.name = res['customerName']
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
filterStatus(status) {
    this.pending = false
    if (status == 1) {
        this.pending = true
    }
    this.fetchList(status)
}
updateOrder() {
    let order = JSON.parse(sessionStorage.getItem('cartOrders'))
    const data = {
        'orderDetails': order
    }
    this.apiService.getListpost('orders/add-from-cart/' + this.orderId, data).subscribe({
        next: res => {
            this.showSuccessAlert()
            console.log(res);
            sessionStorage.removeItem('cartOrders');
            // window.location.reload()
            this.router.navigate(['ordersmanagement/' +this.orderId])
        }, error: e => {
            this.showErrorAlert()
        }
    })
}
increaseQuantity(productId: string) {
    const storedData = JSON.parse(sessionStorage.getItem('cartOrders'));
    if (storedData) {
        // Tìm sản phẩm trong mảng `storedData` dựa trên `productId`
        const productIndex = storedData.findIndex((item: any) => item.productId === productId);
        if (productIndex !== -1) {
            // Tăng số lượng sản phẩm
            storedData[productIndex].quantity++;
            // Cập nhật lại sessionStorage
            sessionStorage.setItem('cartOrders', JSON.stringify(storedData));
        }
    }
    this.getproducts()
    this.caculateTotal()

}
decreaseQuantity(productId: string) {
    const storedData = JSON.parse(sessionStorage.getItem('cartOrders'));
    if (storedData) {
        // Tìm sản phẩm trong mảng `storedData` dựa trên `productId`
        const productIndex = storedData.findIndex((item: any) => item.productId === productId);
        if (productIndex !== -1) {
            // Giảm số lượng sản phẩm
            if (storedData[productIndex].quantity > 1) {
                storedData[productIndex].quantity--;
                // Cập nhật lại sessionStorage
                sessionStorage.setItem('cartOrders', JSON.stringify(storedData));
            }
        }
    }
    this.getproducts()
    this.caculateTotal()

}
showConfirmDeleteDialog = false;

deleteProduct(productId: string) {
    const storedData = JSON.parse(sessionStorage.getItem('cartOrders'));
    if (storedData) {
        const updatedData = storedData.filter((item: any) => item.productId !== productId);
        sessionStorage.setItem('cartOrders', JSON.stringify(updatedData));
    }
    this.getproducts()
    this.caculateTotal()

}
toDetails(){
    this.router.navigate(['ordersmanagement',  this.orderId])
    
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
