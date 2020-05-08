import {Component, Inject, Input, OnInit} from '@angular/core';
import {IBoxClickEvent} from "../positioned-popup/models/IBoxClickEvent";
import {OverlayRef} from "@angular/cdk/overlay";
import {POPUP_DATA, IPopupData} from "./popup-data";

@Component({
  selector: 'app-example-popup',
  templateUrl: './example-popup.component.html',
  styleUrls: ['./example-popup.component.scss']
})
export class ExamplePopupComponent {
  constructor(
    private overlayRef: OverlayRef,
    @Inject(POPUP_DATA) public data: IPopupData,
  ) {}

  onPopupClosed() {
    console.log('Popup closed');
    this.overlayRef.dispose();
  }
}
