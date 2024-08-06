// import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiModule } from '../shared/ui/ui.module';
import { WidgetModule } from '../shared/widget/widget.module';

import { PagesRoutingModule } from './pages-routing.module';

import { NgbNavModule, NgbDropdownModule, NgbTooltipModule, NgbPaginationModule, NgbDatepickerModule, NgbDateAdapter, NgbDateParserFormatter, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FullCalendarModule } from '@fullcalendar/angular';
// import { DndModule } from 'ngx-drag-drop';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { DashboardComponent } from './dashboard/dashboard.component';
// import { EcommerceModule } from './ecommerce/ecommerce.module';
// import { EmailModule } from './email/email.module';
// import { UIModule } from './ui/ui.module';
// import { IconsModule } from './icons/icons.module';
// import { ChartModule } from './chart/chart.module';
// import { FormModule } from './form/form.module';
// import { TablesModule } from './tables/tables.module';
// import { MapsModule } from './maps/maps.module';
import { ServicesComponent } from './services/services.component';
import { CustomAdapter, CustomDateParserFormatter } from '../shared/services/common.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { OrdersComponent } from './listtransactions/orders.component';
import { LightboxModule } from 'ngx-lightbox';
import { TranslateModule } from '@ngx-translate/core';
import { LocationComponent } from './location/location.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { RolesComponent } from './listdevices/roles.component';
import { UsersComponent } from './users/users.component';
import { IncidentComponent } from './incident/incident.component';
import { CustomersComponent } from './customers/customers.component';
import { DetailsComponent } from './detailsCutstomers/details.component';
import { DetailsTransactionsComponent } from './details-transactions/details-transactions.component';
import { ListTransactionsComponent } from './list-transactions/list-transactions.component';
// import { QrpayCodeComponent } from './qrpay-code/qrpay-code.component';
import { ListQrpayCodeComponent } from './list-qrpay-code/list-qrpay-code.component';
import { DetailQrpayCodeComponent } from './detail-qrpay-code/detail-qrpay-code.component';
import { TokensManageComponent } from './tokens-manage/tokens-manage.component';
import { CreateOrderComponent } from './create-order/create-order.component';
// import { CreateQrcodeComponent } from './create-qrcode/create-qrcode.component';
import { QrCodeModule } from 'ng-qrcode';
// import { ListCreateOrderComponent } from './list-create-order/list-create-order.component';
import { DetailCreateOrderComponent } from './detail-create-order/detail-create-order.component';
import { ListBankAccountComponent } from './list-bank-account/list-bank-account.component';
import { DetailBankaccountComponent } from './detail-bankaccount/detail-bankaccount.component';
// import { ListWorkspaceComponent } from './list-workspace/list-workspace.component';
import { AccountComponent } from './account/account.component';
import { ListMemberComponent } from './list-member/list-member.component';
import { CurrencyMaskDirective } from "./currency-mask.directive";
import { CurrencyMaskInputMode,NgxCurrencyModule } from "ngx-currency";
import { ListWorkspaceComponent } from './list-workspace/list-workspace.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { DetailWorkspaceComponent } from './detail-workspace/detail-workspace.component';
import { KitchensComponent } from './kitchens/kitchens.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { ServeManagementComponent } from './serve-management/serve-management.component';
import { ServeComponent } from './serve/serve.component';
import { ListproductComponent } from './listproduct/listproduct.component';
import { BillManagerComponent } from './bill-manager/bill-manager.component';
import { DetailsBillComponent } from './details-bill/details-bill.component';
import { ReturnFoodComponent } from './return-food/return-food.component';
import { OrderWaiterComponent } from './order-waiter/order-waiter.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SplitOrdersComponent } from './split-orders/split-orders.component';
import { ShopManagerComponent } from './shop-manager/shop-manager.component';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 0.3
};

export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: ".",
  nullable: true,
  min: null,
  max: null,
  inputMode: CurrencyMaskInputMode.FINANCIAL
};

@NgModule({
  declarations: [
    DashboardComponent, 
    ServicesComponent, 
    OrdersComponent, 
    LocationComponent, 
    RolesComponent, 
    UsersComponent, 
    IncidentComponent, 
    CustomersComponent, 
    DetailsComponent, 
    DetailsTransactionsComponent, 
    ListTransactionsComponent, 
    ListQrpayCodeComponent, 
    DetailQrpayCodeComponent, 
    TokensManageComponent, 
    CreateOrderComponent, 
    DetailCreateOrderComponent,
    ListBankAccountComponent,
    DetailBankaccountComponent,
    AccountComponent,
    // ListWorkspaceComponent,
    ListMemberComponent,
    CurrencyMaskDirective,
    ListWorkspaceComponent,
    PagenotfoundComponent,
    DetailWorkspaceComponent,
    KitchensComponent,
    OrderManagementComponent,
    ServeManagementComponent,
    ServeComponent,
    ListproductComponent,
    BillManagerComponent,
    DetailsBillComponent,
    ReturnFoodComponent,
    OrderWaiterComponent,
    EditProfileComponent,
    SplitOrdersComponent,
    ShopManagerComponent,
    OrdersDetailComponent,    
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    UiModule,
    Ng2SearchPipeModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgxCurrencyModule,

    // NgxCurrencyDirective,
    // NgApexchartsModule,
    PerfectScrollbarModule,
    QrCodeModule,
    // DndModule,
    FullCalendarModule,
    // IncidentComponent,
    // EcommerceModule,
    // EmailModule,
    // IconsModule,
    // ChartModule,
    // FormModule,
    // TablesModule,
    // MapsModule,
    // LeafletModule,
    WidgetModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgSelectModule,
    ChartsModule,
    LightboxModule,
    NgbCarouselModule,
    TranslateModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAmjEn7OoUoj3EPApR7SvqCWxamJJAb6ig'
    // }),
    GoogleMapsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig)
    
    // Goog
    // AgmJsMarkerClusteredModule
    // AgmMarkerClustererModule
  ],
  exports: [CurrencyMaskDirective],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class PagesModule { }
