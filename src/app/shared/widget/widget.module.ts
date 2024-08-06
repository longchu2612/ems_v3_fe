import { ChartModule } from '../../pages/chart/chart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatComponent } from './stat/stat.component';

import { NgbTypeaheadModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Stat2Component } from './stat2/stat2.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [StatComponent, Stat2Component],
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule,
    NgbPaginationModule,
    ChartsModule
  ],
  exports: [StatComponent, Stat2Component]
})
export class WidgetModule { }
