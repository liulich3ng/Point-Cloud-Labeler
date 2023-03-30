import {Label, ShapeType} from "@/cores/labels";
import {reactive} from "vue";
import {annotationCounter} from "@/store/counter";

export interface ObjectState {
  id: number,
  label: Label,
  locked: boolean,
  hidden: boolean,
  points: number[]
}

export abstract class Annotation {
  public id: number;
  public label: Label;
  public locked: boolean;
  public hidden: boolean;

  protected constructor(label: Label, alreadyHasId: boolean, id: number) {
    if (alreadyHasId) {
      annotationCounter.setCounter(id);
    }
    this.id = annotationCounter.incrementAndGetCounter();
    this.label = label;
    this.locked = false;
    this.hidden = false;
  }

  public abstract atFrame(frameNumber: number): ObjectState | null;
}

export class Shape extends Annotation {
  public frameNumber: number;
  public points: number[];

  constructor(label: Label, frameNumber: number, points: number[], alreadyHasId = false, id = 0) {
    super(label, alreadyHasId, id);
    this.frameNumber = frameNumber;
    this.points = points;
  }

  atFrame(frameNumber: number): ObjectState | null {
    if (frameNumber === this.frameNumber) {
      return {
        id: this.id,
        label: this.label,
        hidden: this.hidden,
        locked: this.locked,
        points: this.points,
      }
    }
    return null;
  }
}

interface TrackedShape {
  rotation: number;
  points?: number[];
  attributes: Record<number, string>;
}

// export class Track extends Annotation {
//   public shapes: Record<number, TrackedShape>
//
//   constructor(label: Label) {
//     super(label);
//     this.shapes = {};
//   }
// }
