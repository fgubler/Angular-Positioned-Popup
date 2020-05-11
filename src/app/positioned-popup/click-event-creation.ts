/*
 * Copyright (c) 2020. Florian Gubler
 */

import {IPixelCoordinates} from "./models/IPixelCoordinates";
import {IBoxClickEvent} from "./models/IBoxClickEvent";

/**
 * Get the pixel-coordinates of the click from a {@see MouseEvent}
 */
export function createPixelCoordinatesFromMouseEvent(mouseEvent: MouseEvent): IPixelCoordinates {
  return {
    leftPx: mouseEvent.clientX,
    topPx: mouseEvent.clientY,
  };
}

/**
 * Create a Box-Click event from a click on a HTML-Element (e.g. a button).
 * The idea is that the popup should be positioned relative to that element, independent of
 * the exact point on the element the user actually clicked.
 */
export function createBoxClickEvent(nativeElement: Element): IBoxClickEvent {
  const boundingBox = nativeElement.getBoundingClientRect();

  return {
    clickedBox: {
      boxHeightPx: boundingBox.height,
      boxWidthPx: boundingBox.width,

      topLeftCorner: {
        leftPx: boundingBox.left,
        topPx: boundingBox.top
      },
    }
  };
}
