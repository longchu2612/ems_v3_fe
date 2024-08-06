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

interface listTransactions{
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
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  data = <any>{}
  listData = []
  listTransactions = []
  id: number = 0;
  flag : number = 0
  pageSize = 5
  pageIndex = 1
  totalElements = 2
  listBank = <any>[]
  listTrans = <any>[]

  tableName: string = 'users/';
  // public person  
  constructor(
    public eventService: EventService,
    private apiService: ApiService,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.fetchData();
    // this.getlistBank();
    // this.getlistTransaction();
  }
  fetchData() {

    // params = '&order=updated_at&direction=desc'
    this.eventService.setLoading(true)
    this.apiService.getList(this.tableName + this.id
      // + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.data = res
        this.listData = this.data.transactions
        this.listBank = res['bankaccounts'] ? res['bankaccounts'] : [];
        this.totalElements = res.length
        this.eventService.setLoading(false)
      }
    })
  }
  getlistTransaction(params = '') {
    params = '&order=updated_at&direction=desc'
    this.apiService.getList( 'transactions/' +'get-by-bankaccount/' + (this.selectedId)
      + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
    ).subscribe({
      next: (res) => {
        this.listTrans = res['transactions'] ? res['transactions'] : [];
        this.totalElements = res['pagination']['totalElements'] ? res['pagination']['totalElements'] : '';
        // this.totalElements = res.length
        // this.eventService.setLoading(false)
        // // this.totalElements = res.meta.total
      }
    })
  }
  selectedIndex: number = -1;
  selectedId: number | null = null;
  onRowClick(data: any, index: number) {
    this.selectedIndex = index;
    this.selectedId = data.id;
    this.getlistTransaction()    
    this.flag = 1
  }
}
