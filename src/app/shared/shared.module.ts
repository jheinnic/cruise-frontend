import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {PortalModule} from '@angular/cdk/portal';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatTabsModule
} from '@angular/material';
import {LayoutModule} from '@angular/cdk/layout';

// import {ColorPickerModule} from 'ngx-color-picker';

import {SiegeDashboardComponent} from './siege-dashboard/siege-dashboard.component';
import {NavbarTemplateDirective} from './navbar/navbar-template.directive';
import {NavbarComponent} from './navbar/navbar.component';

// Consider whether NavbarComponent could migrate to CoreModule, leaving NavbarTemplateDirective behind as its public-facing API.
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LayoutModule,
    FlexLayoutModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    // ColorPickerModule
  ],
  declarations: [
    SiegeDashboardComponent,
    NavbarComponent,
    NavbarTemplateDirective
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    FlexLayoutModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    SiegeDashboardComponent,
    NavbarTemplateDirective,
    NavbarComponent
  ]
})
export class SharedModule {
}
