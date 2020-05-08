import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ClickedCoordinatesHandler} from '../helpers/clicked-coordinates-handler';
import {IBoxClickEvent} from "../models/IBoxClickEvent";
import {LatchOrientation} from "../enums/latch-orientation";
import {BadBrowser} from "../enums/BadBrowser";
import {IPixelCoordinates} from "../models/IPixelCoordinates";

const px = 'px';
const unset = 'unset';

const popupExceedingMainAxisPx = 30;  // how far the popup exceeds the click in the non-growing direction of the orientation-axis
const latchDimensionPx = 10; // Beware: this needs to be kept in sync with the CSS!
const marginToViewPortPx = 2; // make sure the popup stays on the screen

/**
 * A rectangle-container with a latch which is positioned such that the latch points toward the clicked position or box.
 * Depending on {@see _latchOrientation}, the latch will either be to the left/right of the click or above/below it.
 *  - case {@see PositionedPopupLatchOrientation.horizontal}:
 *    - the latch will be to the left of the click if the click is in the right half of the screen; otherwise on the right.
 *    - the container will grow from the latch downwards if the click is in the upper half of the screen; otherwise upwards.
 *  - case {@see PositionedPopupLatchOrientation.vertical}:
 *    - the container will grow from the latch downwards if the click is in the upper half of the screen; otherwise upwards.
 *    - the container will grow from the latch leftwards if the click is in the right half of the screen; otherwise rightwards.
 *
 * Naming:
 *  - main-axis: the axis defined by {@see _latchOrientation}
 *  - off-axis: the other axis
 */
@Component({
  selector: 'app-positioned-popup',
  templateUrl: './positioned-popup.component.html',
  styleUrls: ['./positioned-popup.component.scss']
})
export class PositionedPopupComponent implements OnChanges {
  @ViewChild('positionedPopup', {static: true}) private positionedPopup: ElementRef<HTMLInputElement>;
  @ViewChild('background', {static: true}) private background: ElementRef<HTMLInputElement>;

  /**
   * @param clickEvent describes the box which was clicked.
   * If a box is passed, the popup will be positioned to touch the bounds of that box.
   * If no box is passed, the popup will be positioned to touche the clicked coordinates.
   */
  @Input() clickEvent: IBoxClickEvent;
  @Input() latchOrientation: LatchOrientation;

  @Input() readonly visible: boolean;
  @Input() readonly applyCorrectionForBrowser: BadBrowser; // some browsers have problems e.g. with the viewport-height

  @Output() readonly popupClosed = new EventEmitter<void>();

  private readonly _coordinatesHandler: ClickedCoordinatesHandler;

  dynamicPopupStyle: any;
  dynamicLatchStyle: any;

  constructor() {
    this._coordinatesHandler = new ClickedCoordinatesHandler();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._updateDynamicStyles();
  }

  get latchOrientationHorizontal(): boolean {
    const latchOrientation = this.latchOrientation || LatchOrientation.horizontal;
    return latchOrientation === LatchOrientation.horizontal;
  }

  get growRightward(): boolean {
    return this._coordinatesHandler.growRightward;
  }

  get growDownward(): boolean {
    return this._coordinatesHandler.growDownward;
  }

  /**
   * @return the dimensions of the parent window; cannot use the JS {@see window} because the iPad cannot handle it properly.
   */
  private get _parentWindow(): ClientRect {
    return this.background.nativeElement.getBoundingClientRect();
  }

  // =====================================================================
  // ========================= Dynamic Styling ===========================
  // =====================================================================

  private _updateDynamicStyles() {
    this._coordinatesHandler.update(this.clickEvent, this.latchOrientationHorizontal);
    this._updatePopupStyle(this._coordinatesHandler.coordinatesToTouch);
    this._updateLatchStyle(this._coordinatesHandler.coordinatesToTouch);
  }

  // ===================== Popup Styling =======================
  private _updatePopupStyle(coordinates: IPixelCoordinates) {
    const leftPx = this.growRightward ? this._computeContainerLeftPx(coordinates) : null;
    const rightPx = this.growRightward ? null : this._computeContainerRightPx(coordinates);
    const topPx = this.growDownward ? this._computeContainerTopPx(coordinates) : null;
    const bottomPx = this.growDownward ? null : this._computeContainerBottomPx(coordinates);

    const left = this._getPositionCss(leftPx);
    const right = this._getPositionCss(rightPx);
    const top = this._getPositionCss(topPx);
    const bottom = this._getPositionCss(bottomPx);

    const verticalPosition = this.growDownward ? top : bottom;
    const horizontalPosition = this.growRightward ? left : right;

    this.dynamicPopupStyle = {
      left,
      right,
      top,
      bottom,
      maxWidth: `calc(100% - ${horizontalPosition} - ${marginToViewPortPx}${px})`,
      maxHeight: `calc(100% - ${verticalPosition} - ${marginToViewPortPx}${px}${this._browserMaxHeightCorrection})`,
    };
  }

  private get _browserMaxHeightCorrection(): string {
    if (!this.growDownward) {
      return '';  // the correction is only needed when growing downward.
    }

    switch (this.applyCorrectionForBrowser) {
      case BadBrowser.iPadSafari:
        return ' - 40px';
      case BadBrowser.iPadChrome:
        return ' - 75px';
      default:
        return '';
    }
  }

  /**
   * this should only be used when the container grows rightwards
   */
  private _computeContainerLeftPx(coordinates: IPixelCoordinates): number {
    if (!this.growRightward) {
      throw Error('Only use position-left if the container grows toward the right!');
    }

    if (this.latchOrientationHorizontal) {
      return coordinates.leftPx + latchDimensionPx;
    }

    return coordinates.leftPx - this._getPopupExceedingPx(coordinates.leftPx);
  }

  /**
   * this should only be used when the container grows leftwards
   */
  private _computeContainerRightPx(coordinates: IPixelCoordinates): number {
    if (this.growRightward) {
      throw Error('Only use position-right if the container grows toward the left!');
    }

    const coordinatesRightPx = this._parentWindow.width - coordinates.leftPx;

    if (this.latchOrientationHorizontal) {
      return coordinatesRightPx + latchDimensionPx;
    }

    return coordinatesRightPx - this._getPopupExceedingPx(coordinatesRightPx);
  }

  /**
   * this should only be used when the container grows downwards
   */
  private _computeContainerTopPx(coordinates: IPixelCoordinates): number {
    if (!this.growDownward) {
      throw Error('Only use position-top if the container grows toward the bottom!');
    }

    if (this.latchOrientationHorizontal) {
      return coordinates.topPx - this._getPopupExceedingPx(coordinates.topPx);
    }

    return coordinates.topPx + latchDimensionPx;
  }

  /**
   * this should only be used when the container grows upwards
   */
  private _computeContainerBottomPx(coordinates: IPixelCoordinates): number {
    if (this.growDownward) {
      throw Error('Only use position-bottom if the container grows toward the top!');
    }

    const coordinatesBottomPx = this._parentWindow.height - coordinates.topPx;

    if (this.latchOrientationHorizontal) {
      return coordinatesBottomPx - this._getPopupExceedingPx(coordinatesBottomPx);
    }

    return coordinatesBottomPx + latchDimensionPx;
  }

  private _getPositionCss(positionPx: number): string {
    if (positionPx === null || positionPx === undefined) {
      return unset;
    }

    return `${positionPx}${px}`;
  }

  private _getPopupExceedingPx(availableSpace: number): number {
    let exceedingPx = popupExceedingMainAxisPx;

    const popupSize = this.latchOrientationHorizontal ?
      this.positionedPopup.nativeElement.getBoundingClientRect().height :
      this.positionedPopup.nativeElement.getBoundingClientRect().width;

    if (popupSize <= (2 * exceedingPx + latchDimensionPx)) {
      exceedingPx = (popupSize - latchDimensionPx) / 2; // if the popup is too small, place the latch in the center of its side.
    }

    exceedingPx = Math.min(exceedingPx, availableSpace); // do not leave the view-port
    return Math.max(exceedingPx, latchDimensionPx / 2);   // leave space for the latch (even if that means leaving the view-port)
  }

  // ===================== Latch Styling =======================

  private _updateLatchStyle(coordinates: IPixelCoordinates) {
    const topPx = this._computeLatchTopPx(coordinates);
    const leftPx = this._computeLatchLeftPx(coordinates);

    this.dynamicLatchStyle = {
      top: `${topPx}${px}`,
      left: `${leftPx}${px}`,
    };
  }

  private _computeLatchTopPx(coordinates: IPixelCoordinates): number {
    if (this.latchOrientationHorizontal) {
      return coordinates.topPx - latchDimensionPx / 2;
    }

    return this.growDownward ? coordinates.topPx : coordinates.topPx - latchDimensionPx;
  }

  private _computeLatchLeftPx(coordinates: IPixelCoordinates): number {
    if (this.latchOrientationHorizontal) {
      return this.growRightward ? coordinates.leftPx : coordinates.leftPx - latchDimensionPx;
    }

    return coordinates.leftPx - latchDimensionPx / 2;
  }


  // =====================================================================
  // ========================== Event Handling ===========================
  // =====================================================================

  @HostListener('window:keyup.esc') onKeyUp() {
    this.closePopup();
  }

  ignoreClick(event: MouseEvent) {
    event.stopPropagation();
  }

  closePopup() {
    this.popupClosed.emit();
  }
}
