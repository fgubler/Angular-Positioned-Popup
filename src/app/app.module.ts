import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PositionedPopupModule} from "./positioned-popup/positioned-popup.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    PositionedPopupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
