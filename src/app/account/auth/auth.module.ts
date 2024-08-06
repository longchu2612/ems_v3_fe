import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UiModule } from '../../shared/ui/ui.module';
import { AuthRoutingModule } from './auth-routing';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { TranslateModule } from '@ngx-translate/core';
import { WorkspaceComponent } from './workspace/workspace.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent, WorkspaceComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UiModule,
    AuthRoutingModule,
    TranslateModule,
    FormsModule
  ]
})
export class AuthModule { }
