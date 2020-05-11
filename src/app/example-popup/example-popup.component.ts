import {Component, Inject, Input, OnInit} from '@angular/core';
import {IBoxClickEvent} from "../positioned-popup/models/IBoxClickEvent";
import {OverlayRef} from "@angular/cdk/overlay";
import {POPUP_DATA, IPopupData} from "./popup-data";
import {LatchOrientation} from "../positioned-popup/enums/latch-orientation";
import {ICoordinatesCorrection} from "../positioned-popup/models/ICoordinatesCorrection";

@Component({
  selector: 'app-example-popup',
  templateUrl: './example-popup.component.html',
  styleUrls: ['./example-popup.component.scss']
})
export class ExamplePopupComponent {
  readonly coordinatesCorrection: ICoordinatesCorrection = {
    [LatchOrientation.horizontal]: {
      topPx: -3.5,
      leftPx: 0,
    },
    [LatchOrientation.vertical]: {
      topPx: 0,
      leftPx: -5.3,
    }
  };


  constructor(
    private overlayRef: OverlayRef,
    @Inject(POPUP_DATA) public data: IPopupData,
  ) {}

  onPopupClosed() {
    this.overlayRef.dispose();
  }
}
