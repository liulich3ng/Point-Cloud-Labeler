import {Label} from "@/cores/labels";
import {annotationCounter} from "@/store/counter";
import {annotationObjects} from "@/store/annotations";

export interface ObjectState {
  id: number,
  label: Label,
  locked: boolean,
  hidden: boolean,
  points: number[]
}

interface Shape {
  frame: number,
  points: number[]
}

export class Annotation {
  public id: number;
  public label: Label;
  private locked: boolean;
  private hidden: boolean;
  public shapes: Shape[];

  constructor(label: Label, frame: number, points: number[], id = -1) {
    if (id > 0) {
      annotationCounter.setCounter(id);
    }
    this.id = annotationCounter.incrementAndGetCounter();
    this.label = label;
    this.locked = false;
    this.hidden = false;
    this.shapes = [{
      frame,
      points
    }];
  }

  toggleVisibility() {
    this.hidden = !this.hidden;
  }

  toggleLock() {
    this.locked = !this.locked;
  }

  delete() {
    const index = annotationObjects.findIndex(annotationObject => annotationObject.id === this.id);
    if (index >= 0)
      annotationObjects.splice(index, 1);
  }

  atFrame(frame: number): ObjectState | null {
    for (const shape of this.shapes) {
      if (shape.frame === frame) {
        return {
          id: this.id,
          label: this.label,
          hidden: this.hidden,
          locked: this.locked,
          points: shape.points,
        };
      }
    }
    return null;
  }

  deleteFrame(frame: number) {

  }
}
