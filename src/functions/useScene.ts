/**
 * One frame have one SCENE. One SCENE includes:
 *  - Helpers:
 *    - axesHelper
 *    - cuboidHelper
 *    - dotHelper
 *    - gridHelper
 *  - Annotations
 *    - Point Cloud
 *    - annotation1
 *    - annotation2
 *    - ...
 */
import {
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  GridHelper,
  Group,
  Material,
  Points,
  PointsMaterial,
  Scene,
} from "three";
import {makeCuboid} from "@/functions/useCuboid";
import {pointCloud, visualConfig} from "@/store/global";
import {annotationObjectsAtCurrentFrame} from "@/store/annotations";

export const SCENE = new Scene();
export const ANNOTATIONS = new Group();
export const HELPERS = new Group();
export let dotHelper: Points;
export const cuboidHelper = makeCuboid();

initHelpers();

export function makeScene() {
  if (!pointCloud.value) {
    return;
  }
  SCENE.clear();
  ANNOTATIONS.clear();

  SCENE.add(HELPERS);
  ((HELPERS.getObjectByName('gridHelper') as GridHelper)
    .material as Material)
    .visible = visualConfig.showGround;

  ANNOTATIONS.add(pointCloud.value);

  annotationObjectsAtCurrentFrame.value.forEach((annotation) => {
    if(annotation.hidden) return;
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
      color: '#ffff00',
      sizeAttenuation: false
    })
  );

  const gridHelper = new GridHelper(1000, 1000);
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.name = 'gridHelper';

  HELPERS.add(axesHelper);
  HELPERS.add(gridHelper);
  HELPERS.add(dotHelper);
  HELPERS.add(cuboidHelper);
}

