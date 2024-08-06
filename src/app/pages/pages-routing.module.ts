import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ServicesComponent } from './services/services.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './listtransactions/orders.component';
import { LocationComponent } from './location/location.component';
import { RolesComponent } from './listdevices/roles.component';
import { UsersComponent } from './users/users.component';
import { IncidentComponent } from './incident/incident.component';
import { CustomersComponent } from './customers/customers.component';
import { DetailsComponent } from './detailsCutstomers/details.component';
import { ListTransactionsComponent } from './list-transactions/list-transactions.component';
import { DetailsTransactionsComponent } from './details-transactions/details-transactions.component';
import { ListQrpayCodeComponent } from './list-qrpay-code/list-qrpay-code.component';
import { DetailQrpayCodeComponent } from './detail-qrpay-code/detail-qrpay-code.component';
import { TokensManageComponent } from './tokens-manage/tokens-manage.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { LoginComponent } from '../account/auth/login/login.component';
import { DetailCreateOrderComponent } from './detail-create-order/detail-create-order.component';
import { AuthRoleGuard } from '../core/guards/authRole.guard';
// import { ListWorkspaceComponent } from './list-workspace/list-workspace.component';
import { AccountComponent } from './account/account.component';
import { ListMemberComponent } from './list-member/list-member.component';
import { ListWorkspaceComponent } from './list-workspace/list-workspace.component';
import { DetailWorkspaceComponent } from './detail-workspace/detail-workspace.component';
import { KitchensComponent } from './kitchens/kitchens.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';
import { ServeManagementComponent } from './serve-management/serve-management.component';
import { ServeComponent } from './serve/serve.component';
import { CartpageComponent } from './cartpage/cartpage.component';
import { ListproductComponent } from './listproduct/listproduct.component';
import { BillManagerComponent } from './bill-manager/bill-manager.component';
import { DetailsBillComponent } from './details-bill/details-bill.component';
import { ReturnFoodComponent } from './return-food/return-food.component';
import { OrderWaiterComponent } from './order-waiter/order-waiter.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SplitOrdersComponent } from './split-orders/split-orders.component';
import { ShopManagerComponent } from './shop-manager/shop-manager.component';
// import { QrCodeComponent } from 'ng-qrcode';
// import { TablePageComponent } from './table-page/table-page.component';


const routes: Routes = [
    // { 
    //     path: '',
    //     redirectTo:'login',
    //     pathMatch: 'full'
    // },
    // { path: '', component: LoginComponent},
    {
        path: '', component: DashboardComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager']
        }
    },

    // {
    //     path: 'person', component: AccountComponent
    //     , canActivate: [AuthRoleGuard],data: {
    //         accessRole: ['user']
    //     } 
    // },

    //devices
    {
        path: 'products', component: RolesComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager']
        }
    },
    {
        path: 'shop-management', component: ShopManagerComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin']
        }
    },
    {
        path: 'cart', component: CartpageComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
            // accessRole: ['admin','waiter']
        }
    },
    //serve
    // {
    //     path: 'serve/serve-service/:id', component: ServeManagementComponent, canActivate: [AuthRoleGuard], data: {
    //         accessRole: ['waiter']
    //     }
    // },
    {
        path: 'ordersmanagement/:id', component: ServeManagementComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    {
        path: 'split-orders', component: SplitOrdersComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    {
        path: 'serve', component: ServeComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    {
        path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager', 'waiter', 'cashier', 'chef']
        }
    },
    {
        path: 'users', component: UsersComponent
        , canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin' ,'manager']
        }
    },
   
    {
        path: 'table', component: IncidentComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager']
        }
    },
    {
        path: 'users/details/:id', component: DetailsComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'user']
        }
    },

    //transactions  
    {
        path: 'transactions/details-transactions/:id', component: DetailsTransactionsComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager', 'cashier']
        }
    },
    // { path: '404', component: PagenotfoundComponent, canActivate: [AuthRoleGuard], data: {
    //     accessRole: ['admin','user']
    // } },
    {
        path: 'transactions', component: ListTransactionsComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager', 'cashier']
        }
    },
    {
        path: 'kitchen', component: KitchensComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['chef']
        }
    },
    {
        path: 'menus', component: ListproductComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    {
        path: 'orders', component: OrderWaiterComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    // { path: 'table', component: TablePageComponent, canActivate: [AuthRoleGuard], data: {
    //     accessRole: ['admin','manager']
    // } },
    //qr-pay



    //create-order
    {
        path: 'create-order', component: CreateOrderComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['user']
        }
    },
    {
        path: 'detail-create-order', component: DetailCreateOrderComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['user']
        }
    },
    {
        path: 'bill-manager', component: BillManagerComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    {
        path: 'bill-manager/details-bill/:id', component: DetailsBillComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },
    {
        path: 'return-food', component: ReturnFoodComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['waiter']
        }
    },

    //ordersmanagement
    {
        path: 'ordersmanagement', component: OrderManagementComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['cashier', ]
        }
    },
    {
        path: 'ordersmanagement/order-details/:id', component: OrdersDetailComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['cashier',  'waiter']
        }
    },
    //workspace
    {
        path: 'categories', component: ListWorkspaceComponent, canActivate: [AuthRoleGuard], data: {
            accessRole: ['admin', 'manager']
        }
    },



];

@NgModule({
    imports: [RouterModule.forChild(routes),
        // QRCodeModule,
    ],
    exports: [RouterModule]
    //
})
export class PagesRoutingModule { }