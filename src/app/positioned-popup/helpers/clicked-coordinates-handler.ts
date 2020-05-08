import {IPixelCoordinates} from "../models/IPixelCoordinates";
import {IBoxClickEvent} from "../models/IBoxClickEvent";
import {IBoxLineCenterPoints} from "../models/IBoxLineCenterPoints";
import {LatchOrientation} from "../enums/latch-orientation";
import {latchPositionCorrection} from "./coordinates-corrections";

/**
 * Helper class to determine the exact coordinates to be touched by the user.
 * This also involves sanitization.
 */
export class ClickedCoordinatesHandler {
  private _growDownward: boolean;
  private _growRightward: boolean;
  private _coordinatesToTouch: IPixelCoordinates;

  constructor() {}

  // =====================================================================
  // ========================= Public Interface ==========================
  // =====================================================================

  /**
   * Rerun the computations
   */
  update(clickEvent: IBoxClickEvent, latchOrientationHorizontal: boolean) {
    const box = this._getBoxPointsOfInterest(clickEvent, latchOrientationHorizontal);

    this._updateGrowDownward(box.centerLeft);
    this._updateGrowRightward(box.topCenter);

    this._coordinatesToTouch = this._getTargetCoordinates(box, latchOrientationHorizontal);
  }

  /**
   * @return whether the container grows from {@see coordinatesToTouch} downwards.
   */
  get growDownward(): boolean {
    return this._growDownward;
  }

  /**
   * @return whether the container grows from {@see coordinatesToTouch} towards the right.
   */
  get growRightward(): boolean {
    return this._growRightward;
  }

  /**
   * @return the coordinates clicked which are to be touched by the latch.
   */
  get coordinatesToTouch(): IPixelCoordinates {
    return this._coordinatesToTouch;
  }

  // =====================================================================
  // ========================= Computation Logic =========================
  // =====================================================================

  private _getBoxPointsOfInterest(clickEvent: IBoxClickEvent, latchOrientationHorizontal: boolean): IBoxLineCenterPoints {
    const clickedBox = clickEvent.clickedBox;

    if (!clickedBox) {
      return {
        topCenter: clickEvent.clickedPosition,
        bottomCenter: clickEvent.clickedPosition,
        centerLeft: clickEvent.clickedPosition,
        centerRight: clickEvent.clickedPosition,
      };
    }

    clickedBox.topLeftCorner = this._correctClickedBoxCoordinates(clickedBox.topLeftCorner, latchOrientationHorizontal);

    return {
      topCenter: {
        leftPx: clickedBox.topLeftCorner.leftPx + clickedBox.boxWidthPx / 2,
        topPx: clickedBox.topLeftCorner.topPx,
      },
      bottomCenter: {
        leftPx: clickedBox.topLeftCorner.leftPx + clickedBox.boxWidthPx / 2,
        topPx: clickedBox.topLeftCorner.topPx + clickedBox.boxHeightPx,
      },
      centerLeft:  {
        leftPx: clickedBox.topLeftCorner.leftPx,
        topPx: clickedBox.topLeftCorner.topPx + clickedBox.boxHeightPx / 2,
      },
      centerRight: {
        leftPx: clickedBox.topLeftCorner.leftPx + clickedBox.boxWidthPx,
        topPx: clickedBox.topLeftCorner.topPx + clickedBox.boxHeightPx / 2,
      },
    };
  }

  /**
   * for some reason, the coordinates of a clicked box ({@param boxCoordinates}) must be slightly corrected to get a nicely
   * centered latch.
   */
  private _correctClickedBoxCoordinates(boxCoordinates: IPixelCoordinates, latchOrientationHorizontal: boolean): IPixelCoordinates {
    if (latchOrientationHorizontal) {
      return {
        leftPx: boxCoordinates.leftPx + latchPositionCorrection[LatchOrientation.horizontal].leftPx,
        topPx: boxCoordinates.topPx + latchPositionCorrection[LatchOrientation.horizontal].topPx,
      };
    }

    return {
      leftPx: boxCoordinates.leftPx + latchPositionCorrection[LatchOrientation.vertical].leftPx,
      topPx: boxCoordinates.topPx + latchPositionCorrection[LatchOrientation.vertical].topPx,
    };
  }

  private _updateGrowDownward(coordinates: IPixelCoordinates) {
    this._growDownward = coordinates.topPx < window.innerHeight / 2;
  }

  private _updateGrowRightward(coordinates: IPixelCoordinates) {
    this._growRightward = coordinates.leftPx < window.innerWidth / 2;
  }

  /**
   * @return the point on the {@param box} which should be touched by the latch
   */
  private _getTargetCoordinates(box: IBoxLineCenterPoints, latchOrientationHorizontal: boolean): IPixelCoordinates {
    if (latchOrientationHorizontal) {
      return this._growRightward ? box.centerRight : box.centerLeft;
    }

    return this._growDownward ? box.bottomCenter : box.topCenter;
  }
}
