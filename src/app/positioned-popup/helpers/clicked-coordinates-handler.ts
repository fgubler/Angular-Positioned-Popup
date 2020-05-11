import {IPixelCoordinates} from "../models/IPixelCoordinates";
import {IBoxClickEvent} from "../models/IBoxClickEvent";
import {IBoxLineCenterPoints} from "../models/IBoxLineCenterPoints";
import {LatchOrientation} from "../enums/latch-orientation";
import {ICoordinatesCorrection} from "../models/ICoordinatesCorrection";

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
  update(clickEvent: IPixelCoordinates | IBoxClickEvent, latchOrientationHorizontal: boolean, correction: ICoordinatesCorrection) {
    const box = this._getBoxPointsOfInterest(clickEvent, latchOrientationHorizontal, correction);

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

  private _getBoxPointsOfInterest(
    clickEvent: IPixelCoordinates | IBoxClickEvent, latchOrientationHorizontal: boolean, correction: ICoordinatesCorrection
  ): IBoxLineCenterPoints {
    const isBoxClickEvent = 'clickedBox' in clickEvent;

    if (!isBoxClickEvent) {
      const clickedCoordinates = clickEvent as IPixelCoordinates;
      const correctedCoordinates = this._correctCoordinates(clickedCoordinates, latchOrientationHorizontal, correction);

      return {
        topCenter: correctedCoordinates,
        bottomCenter: correctedCoordinates,
        centerLeft: correctedCoordinates,
        centerRight: correctedCoordinates,
      };
    }

    const clickedBox = (clickEvent as IBoxClickEvent).clickedBox;

    clickedBox.topLeftCorner = this._correctCoordinates(
      clickedBox.topLeftCorner, latchOrientationHorizontal, correction
    );

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

  private _correctCoordinates(
    coordinates: IPixelCoordinates, latchOrientationHorizontal: boolean, coordinatesCorrection: ICoordinatesCorrection
  ): IPixelCoordinates {
    if (!coordinatesCorrection) {
      return coordinates; // nothing to correct
    }

    if (latchOrientationHorizontal) {
      return {
        leftPx: coordinates.leftPx + coordinatesCorrection[LatchOrientation.horizontal].leftPx,
        topPx: coordinates.topPx + coordinatesCorrection[LatchOrientation.horizontal].topPx,
      };
    }

    return {
      leftPx: coordinates.leftPx + coordinatesCorrection[LatchOrientation.vertical].leftPx,
      topPx: coordinates.topPx + coordinatesCorrection[LatchOrientation.vertical].topPx,
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
