import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PagetitleComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [PagetitleComponent]
})
export class UiModule { }
