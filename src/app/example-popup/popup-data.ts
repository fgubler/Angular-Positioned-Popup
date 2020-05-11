import {IBoxClickEvent} from "../positioned-popup/models/IBoxClickEvent";
import {LatchOrientation} from "../positioned-popup/enums/latch-orientation";
import {InjectionToken} from "@angular/core";
import {IPixelCoordinates} from "../positioned-popup/models/IPixelCoordinates";

export interface IPopupData {
  clickEvent: IBoxClickEvent | IPixelCoordinates;
  latchOrientation: LatchOrientation;
}

export const POPUP_DATA = new InjectionToken<string>('INFO_POPUP_DATA');
