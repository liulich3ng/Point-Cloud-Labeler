import {Label} from "@/cores/Labels";
import {annotationCounter} from "@/store/counter";
import {annotationObjects} from "@/store/annotations";
import {totalFrames} from "@/store/global";
import {interpolate} from "@/functions/useMath";

export interface Frame {
  id: number,
  label: Label,
  locked: boolean,
  hidden: boolean,
  points: number[]
}

interface KeyFrame {
  ended: boolean,
  points: number[]
}

export class Annotation {
  public id: number;
  public label: Label;
  private locked: boolean;
  private hidden: boolean;
  private keyFrames: (KeyFrame | undefined)[] = [];

  constructor(label: Label, frame: number, points: number[], id = -1) {
    if (id > 0) {
      annotationCounter.setCounter(id);
    }
    this.id = annotationCounter.incrementAndGetCounter();
    this.label = label;
    this.locked = false;
    this.hidden = false;
    this.keyFrames[frame] = {
      points,
      ended: false
    };
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

  getFrame(frame: number): Frame | null {
    if (this.keyFrames[frame]) {
      return {
        id: this.id,
        label: this.label,
        hidden: this.hidden,
        locked: this.locked,
        points: this.keyFrames[frame]!.points,
      };
    } else {
      let lastKeyFrameIndex = 0;
      let nextKeyFrameIndex = -1;
      for (let i = frame - 1; i >= 0; --i) {
        if (this.keyFrames[i]) {
          if (this.keyFrames[i]?.ended) {
            return null;
          } else {
            lastKeyFrameIndex = i;
          }
        }
      }
      for (let i = frame + 1; i <= totalFrames.value; ++i) {
        if (this.keyFrames[i]) {
          nextKeyFrameIndex = i;
        }
      }
      if (nextKeyFrameIndex === -1) return null;
      const points1 = this.keyFrames[lastKeyFrameIndex]?.points as number[];
      const points2 = this.keyFrames[nextKeyFrameIndex]?.points as number[];
      const alpha = (frame - lastKeyFrameIndex) / (nextKeyFrameIndex - lastKeyFrameIndex);
      return {
        id: this.id,
        label: this.label,
        hidden: this.hidden,
        locked: this.locked,
        points: interpolate(points1, points2, alpha),
      };
    }
  }

  deleteFrame(frame: number) {
    this.keyFrames[frame] = undefined;
  }

  addFrame(frame: number, points: number[]) {
    this.keyFrames[frame] = {
      points,
      ended: false
    };
  }
}
