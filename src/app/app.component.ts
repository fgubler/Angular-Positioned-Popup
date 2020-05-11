import {Component, ElementRef, ViewChild} from '@angular/core';
import {PopupService} from "./example-popup/popup.service";
import {LatchOrientation} from "./positioned-popup/enums/latch-orientation";
import {
  createBoxClickEvent,
  createPixelCoordinatesFromMouseEvent
} from "./positioned-popup/click-event-creation";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('topLeft', {static: true}) private topLeft: ElementRef<HTMLInputElement>;
  @ViewChild('topRight', {static: true}) private topRight: ElementRef<HTMLInputElement>;
  @ViewChild('bottomLeft', {static: true}) private bottomLeft: ElementRef<HTMLInputElement>;
  @ViewChild('bottomRight', {static: true}) private bottomRight: ElementRef<HTMLInputElement>;

  @ViewChild('centerTopLeft', {static: true}) private centerTopLeft: ElementRef<HTMLInputElement>;
  @ViewChild('centerTopRight', {static: true}) private centerTopRight: ElementRef<HTMLInputElement>;
  @ViewChild('centerBottomLeft', {static: true}) private centerBottomLeft: ElementRef<HTMLInputElement>;
  @ViewChild('centerBottomRight', {static: true}) private centerBottomRight: ElementRef<HTMLInputElement>;

  readonly tooltip = 'Click to open popup!';

  constructor(
    private popupService: PopupService
  ) {}

  onClick(event: MouseEvent, elemName: string, latchVertical?: boolean) {
    const clickedCoordinates = createPixelCoordinatesFromMouseEvent(event);
    const boxClickEvent = createBoxClickEvent(this[elemName].nativeElement);
    const popupData = {
      clickEvent: boxClickEvent,
      latchOrientation: latchVertical ? LatchOrientation.vertical : LatchOrientation.horizontal,
    };
    this.popupService.openOverlay(popupData);
  }
}
