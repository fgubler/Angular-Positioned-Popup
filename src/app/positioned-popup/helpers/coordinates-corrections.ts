import {LatchOrientation} from "../enums/latch-orientation";

/**
 * Depending on the project-setup, there is a static offset between the "correct coordinates, where the latch should point
 * and the coordinates returned by the browser => account for this problem by setting these corrections.
 */
export const latchPositionCorrection = {
  [LatchOrientation.horizontal]: {
    topPx: -3.5,
    leftPx: 0,
  },
  [LatchOrientation.vertical]: {
    topPx: 0,
    leftPx: -5.3,
  }
};
