import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PositionedPopupModule} from "./positioned-popup/positioned-popup.module";
import { ExamplePopupComponent } from './example-popup/example-popup.component';
import {CommonModule} from "@angular/common";
import {OverlayModule} from "@angular/cdk/overlay";

@NgModule({
  imports: [
    BrowserModule,
    PositionedPopupModule,
    CommonModule,
    OverlayModule
  ],
  declarations: [
    AppComponent,
    ExamplePopupComponent,
  ],
  entryComponents: [
    ExamplePopupComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
