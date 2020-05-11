import {IPixelCoordinates} from './IPixelCoordinates';

/**
 * Describes a click on a box-shaped element including the coordinates of the points in the middle of the sides
 */
export interface IBoxClickEvent {
  clickedBox: {
    topLeftCorner: IPixelCoordinates,
    boxWidthPx: number,
    boxHeightPx: number,
  };
}
