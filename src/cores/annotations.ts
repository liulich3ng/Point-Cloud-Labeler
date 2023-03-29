import {Label, ShapeType} from "@/cores/labels";
import {reactive} from "vue";

export class Annotation {
  public label: Label;
  public locked: boolean;
  public hidden: boolean;

  constructor(label: Label) {
    this.label = label;
    this.locked = false;
    this.hidden = false;
  }
}

export class Shape extends Annotation {
  public frameNumber: number;
  public points: number[];

                                                                                                    constructor(label: Label, frameNumber: number, points: number[]) {
    super(label);
    this.frameNumber = frameNumber;
    this.points = points;
  }
}

interface TrackedShape {
  rotation: number;
  points?: number[];
  attributes: Record<number, string>;
}

export class Track extends Annotation {
  public shapes: Record<number, TrackedShape>

  constructor(label: Label) {
    super(label);
    this.shapes = {};
  }
}
