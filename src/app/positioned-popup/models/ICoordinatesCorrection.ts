import {LatchOrientation} from "../enums/latch-orientation";
import {IPixelCoordinates} from "./IPixelCoordinates";

/**
 * Depending on the project-setup, there is a static offset between the "correct coordinates, where the latch should point
 * and the coordinates returned by the browser => account for this problem by setting these corrections.
 */
export interface ICoordinatesCorrection {
  [LatchOrientation.horizontal]: IPixelCoordinates,
  [LatchOrientation.vertical]: IPixelCoordinates;
}
