/**
 * One frame scene includes:
 *  - Point Cloud
 *  - Helpers:
 *    - AxesHelper
 *    - DrawHelper
 *    - DotHelper
 *  - Annotations
 *    - annotation1
 *    - annotation2
 *    - ...
 */
import {
  AxesHelper, BufferAttribute,
  BufferGeometry,
  Group,
  Points,
  PointsMaterial,
  Scene
} from "three";
import {makeCuboid} from "@/functions/useCuboid";
import {POINTS} from "@/store/global";
import {annotationObjectsAtCurrentFrame} from "@/store/annotations";

export const SCENE = new Scene();
export const ANNOTATIONS = new Group();
export const HELPERS = new Group();
export let dotHelper: Points;
export const cuboidHelper = makeCuboid();

initHelpers();

export function makeScene() {
  if (!POINTS.value) {
    return;
  }
  SCENE.clear();
  ANNOTATIONS.clear();

  SCENE.add(HELPERS);

  ANNOTATIONS.add(POINTS.value);

  annotationObjectsAtCurrentFrame.value.forEach((annotation) => {
    const cuboid = makeCuboid(annotation.points, annotation.label.color);
    ANNOTATIONS.add(cuboid);
  });
  SCENE.add(ANNOTATIONS);
}

function initHelpers() {
  const axesHelper = new AxesHelper(10);

  const dotHelperGeometry = new BufferGeometry();
  dotHelperGeometry.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, 0]), 3));
  dotHelper = new Points(
    dotHelperGeometry,
    new PointsMaterial({
      size: 10,
      color: '#00ff00',
      sizeAttenuation: false
    })
  );

  HELPERS.add(axesHelper);
  HELPERS.add(dotHelper);
  HELPERS.add(cuboidHelper);
}

