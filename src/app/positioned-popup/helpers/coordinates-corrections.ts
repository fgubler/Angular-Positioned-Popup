import {LatchOrientation} from "../enums/latch-orientation";

export const latchPositionCorrection = {
  [LatchOrientation.horizontal]: {
    topPx: -12,
    leftPx: 0,
  },
  [LatchOrientation.vertical]: {
    topPx: 0,
    leftPx: -2.3,
  }
};
