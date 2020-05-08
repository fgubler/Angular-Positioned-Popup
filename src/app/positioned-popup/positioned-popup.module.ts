import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PositionedPopupComponent} from './component/positioned-popup.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PositionedPopupComponent
  ],
  exports: [
    PositionedPopupComponent
  ]
})
export class PositionedPopupModule {}
