import { ApiService } from 'src/app/shared/services/api.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-bill-manager',
  templateUrl: './bill-manager.component.html',
  styleUrls: ['./bill-manager.component.scss']
})
export class BillManagerComponent implements OnInit {

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private apiService: ApiService
    ) { }

    @ViewChild('input') input: ElementRef;

    listData = [

    ]
    name = localStorage.getItem('name');
    _data = []
    totalPrice = 0
    totalQuantity = 0
    formData: FormGroup
    orderId = ''
    submitted: boolean
    pending: boolean = false
    status: number
    get form() {
        return this.formData.controls
      }
    ngOnInit() {
        this.orderId = localStorage.getItem('tableId');
        this.fetchList()
    }
    // getproducts() {
    //     this.listData = JSON.parse(sessionStorage.getItem('orderDetails'))
    // }
    reloadData(){
        this.fetchList()
    }
    fetchList() {
        const data = {
        }
        this.apiService.getListpost('orders/list-current' , data).subscribe({
            next: res => {
                this.listData = res['content'] ? res['content'] : []
                console.log(this.listData);
                // this.status = res['status']
                // sessionStorage.setItem('orderDetails', JSON.stringify(data))
                // this.getproducts()
            }
        })
    }
    makeForm(d?) {
        let data = d ? d : <any>{}
        return this.formBuilder.group({
          tableId: [data.id],
          name: [data.name, [Validators.required]],
          customerName: [data.customerName],
        })
      }
    openModal(content: any, data) {
        console.log(data.status);
        this.submitted = false
        if(data.status === false){
            const dataTemp = { 
                tableId : data.id
            }
            this.submitted = true
            this.apiService.getListpost('orders/get-by-table', dataTemp).pipe().subscribe(
                (res) => {
                    localStorage.setItem('user', JSON.stringify(data))
                    localStorage.setItem('orderId', res['id'])
                    this.router.navigate(['/menus'])
                }, err => {
                  console.log(err)
                })        
            } else {
            this.formData = this.makeForm(data)

            let a = this.modalService.open(content, { centered: true, scrollable: true, size: 'lg' });
        }
      }
    
    saveData() {
        if (this.formData.valid) {
          console.log(this.formData.value);
          const data = this.formData.value;
       
          this.apiService.getListpost('orders/get-by-table', data).pipe().subscribe(
            (res) => {
                localStorage.setItem('user', JSON.stringify(data))
                localStorage.setItem('orderId', res['id'])
                this.router.navigate(['/menus'])
            }, err => {
              console.log(err)
            })
          this.apiService.showToast(this.translateService.instant('FORM.Success'), this.translateService.instant('FORM.SuccessMessage'), 'success')
          this.modalService.dismissAll()
    
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
        // this.getproducts()
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
        // this.getproducts()
    }
    showConfirmDeleteDialog = false;

    deleteProduct(productId: string) {
        const storedData = JSON.parse(sessionStorage.getItem('orderDetails'));
        if (storedData) {
            const updatedData = storedData.filter((item: any) => item.id !== productId);
            sessionStorage.setItem('orderDetails', JSON.stringify(updatedData));
        }
        // this.getproducts()
    }
    toDetails(data : any){
        console.log(data);
                this.router.navigate(['bill-manager/details-bill', data.id])
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
