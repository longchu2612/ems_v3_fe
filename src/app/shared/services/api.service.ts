import { Table } from './../../pages/tables/advancedtable/advanced.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';


export interface ListResponse {
  data: [],
  meta: {
    total?: number
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private translate: TranslateService
  ) { }

  getList(table, type = 'admin') {
    return this.httpClient.get(`${table}`).pipe(map(d => d['data'] ? d['data'] : d))
  }

  getList2(table, type = 'admin') {
    return this.httpClient.get(`${table}`).pipe(map((d: ListResponse) => d))
  }
  getListpost(table, data, type = 'admin') {
    return this.httpClient.post(`${table}`, data)
  }
  uploadFile(table: string, data): Observable<any> {
    return this.httpClient.post<any>(`${table}`, data);
  }
  exportExcel(table: string, ): Observable<any> {
    return this.httpClient.get<any>(`${table}`);
  }
  addItem(table, data, type = 'admin') {
    return this.httpClient.post(`${table}`, data)
  }
  updateStatus(table, type = 'admin') {
    return this.httpClient.post(`${table}`, type)
  }
  getbyphone(table, data, type = 'admin') {
    return this.httpClient.post(`${table}`, data)
  }
  getListData(table , type = 'admin') {
    return this.httpClient.get(`${table}`)
    }
  editItem(table, id, data, type = 'admin') {
    return this.httpClient.put(`${table}/${id}`, data)
  }
  deleteItem(table, id, type = 'admin') {
    console.log(`${table}/${id}`)
    return this.httpClient.delete(`${table}/${id}`)
  }

  uploadImage(file) {
    return this.httpClient.post(`file/upload`, file, {
    })
  }
  showToast(title = 'Thông báo', text = '', icon, option = { showCancelButton: false, showConfirmButton: false, timer: 4000 }) {
    Swal.fire({
      title,
      text,
      icon,
      ...option,
      // showCancelButton: false,
      // showConfirmButton: false,
      // confirmButtonColor: '#5438dc',
      // cancelButtonColor: '#ff3d60'
    });
  }
  successmsg() {
  }

  addQRCode(user_id: number, amount: number, token: string, mid: string) {
    // const header = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const qrpaycode = { user_id: user_id, amount: amount, token: token, mid: mid }
    return this.httpClient.post('https://paydee.tomotek.vn/api/mbpaybox/create-qr', qrpaycode)
  }
  // cái add QRcode nó yêu cầu giá trị nào thì anh truyền giá trị đó cho nó tho, anh đang để thừa cái data khi đến  lúc display mới cần cái data đó 

  displayQRCode(user_id: number, amount: number, token: string, mid: string, qr_string: string, bill_number: string) {
    // const header = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    const qrpaycode = { user_id: user_id, amount: amount, token: token, mid: mid, qr_string: qr_string, bill_number: bill_number } // đằng nào cũng vào đây ý anh thì mình để trên đối số luôn
    return this.httpClient.post('https://paydee.tomotek.vn/api/mbpaybox/display-qr', qrpaycode)
  }
  // anh sửa lại cái đối số lấy một cái data thoi để kiểu dữ liệu any
  // nma gui len cho nay kp la device maf laf mid, e thay k
  // hừm em xem lại nào 
  notiQR(user_id: number, amount: number, token: string, mid: string, noti_type: number) {
    const qrpaycode = { user_id: user_id, amount: amount, token: token, mid: mid, noti_type: noti_type }
    return this.httpClient.post('https://paydee.tomotek.vn/api/mbpaybox/noti', qrpaycode)
  }
}
