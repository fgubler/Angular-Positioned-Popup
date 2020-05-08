import {IBoxClickEvent} from "../positioned-popup/models/IBoxClickEvent";
import {LatchOrientation} from "../positioned-popup/enums/latch-orientation";
import {InjectionToken} from "@angular/core";

export interface IPopupData {
  clickEvent: IBoxClickEvent;
  latchOrientation: LatchOrientation;
}

export const POPUP_DATA = new InjectionToken<string>('INFO_POPUP_DATA');
