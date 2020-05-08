import {IPixelCoordinates} from "../models/IPixelCoordinates";
import {IBoxClickEvent} from "../models/IBoxClickEvent";

export function createPixelCoordinatesFromMouseEvent(mouseEvent: MouseEvent): IPixelCoordinates {
  return {
    leftPx: mouseEvent.clientX,
    topPx: mouseEvent.clientY,
  };
}

export function createBoxClickEvent(clickedCoordinates: IPixelCoordinates, nativeElement: Element): IBoxClickEvent {
  const boundingBox = nativeElement.getBoundingClientRect();

  return {
    clickedPosition: clickedCoordinates,

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
