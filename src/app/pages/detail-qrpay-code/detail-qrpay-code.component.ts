import { Transaction } from './../dashboard/dashboard.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/core/services/event.service';
import { ApiService } from 'src/app/shared/services/api.service';

interface listData {
  created_at: string,
  customer_id: number,
  device_id: number,
  id: number,
  status: number,
  total: number,
  transaction_code: string,
  updated_at: string,
}

@Component({
  selector: 'app-detail-qrpay-code',
  templateUrl: './detail-qrpay-code.component.html',
  styleUrls: ['./detail-qrpay-code.component.scss']
})
export class DetailQrpayCodeComponent implements OnInit {

  data = <any>{}
  listData = []
  id: number = 0;
  // eventService: any;
  pageSize = 10
  pageIndex = 1
  totalElements = 2

  tableName: string = 'qrcodes/';
  // public person  
  constructor(
    public eventService: EventService,
    private apiService: ApiService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    // console.log(this.id);
    // console.log(this.listData);

    // this.route.params.subscribe(params => {
    //   let id = Number.parseInt(params['id']);
    //   this.person = this.peopleService.get(id);
    // });
    this.fetchData();
  }
  fetchData() {

    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + this.id
      // + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.data = res
        this.listData = this.data
        // console.log(this.data)

        this.totalElements = res.length
        // // this.totalElements = res.meta.total
        this.eventService.setLoading(false)
      }
    })
  }

}
