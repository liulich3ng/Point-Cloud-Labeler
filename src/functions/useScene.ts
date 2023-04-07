/**
 * One frame scene includes:
 *  - Point Cloud
 *  - Helpers:
 *    - AxesHelper
 *    - DrawHelper
 *    -
 *  - Annotations
 *    - annotation1
 *    - annotation2
 *    - ...
 */
import {AxesHelper, Group, Scene} from "three";
import {makeCuboid} from "@/functions/useCuboid";
import {currentFrame, PointsRecord} from "@/store/global";
import {annotationObjectsAtCurrentFrame} from "@/store/annotations";

export const SCENE = new Scene();
export const ANNOTATIONS = new Group();
export const axesHelper = new AxesHelper(10);
export const drawHelper = makeCuboid();


export function makeScene() {
  SCENE.clear();
  ANNOTATIONS.clear();
  SCENE.add(axesHelper);
  SCENE.add(drawHelper);
  SCENE.add(ANNOTATIONS);

  if (PointsRecord[currentFrame.value]) {
    SCENE.add(PointsRecord[currentFrame.value]);
  }
  console.log(annotationObjectsAtCurrentFrame.value.length);
  annotationObjectsAtCurrentFrame.value.forEach((annotation) => {
    const cuboid = makeCuboid(annotation.points, annotation.label.color);
    ANNOTATIONS.add(cuboid);
  });
}
