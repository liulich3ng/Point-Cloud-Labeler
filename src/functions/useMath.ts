import {groundHeight, seedArea} from "@/store/global";
import {Raycaster, Vector2, Vector3} from "three";
import {perspectiveCamera} from "@/functions/useCamera";
import {BBox} from "@/cores/BBox";

export const raycaster = new Raycaster();
// mouse position in camera's normalized device coordinate (NDC)
export const mouseNDC = new Vector2();

/**
 * mouse position to camera's normalized device coordinate (NDC)
 * @param e
 */
export function computeCurrentMouse(e: MouseEvent) {
  const freeView = document.getElementById('perspective') as HTMLElement;

  mouseNDC.x = (e.offsetX / freeView.clientWidth) * 2 - 1;
  mouseNDC.y = -(e.offsetY / freeView.clientHeight) * 2 + 1;
}

/**
 * let drawHelper move with mouse position
 * @param e
 */
export function mouseToGround(e: MouseEvent) {
  computeCurrentMouse(e);

  const vec = new Vector3(mouseNDC.x, mouseNDC.y, 0)
    .unproject(perspectiveCamera)
    .sub(perspectiveCamera.position)
    .normalize();

  const factor = (groundHeight.value - perspectiveCamera.position.z) / vec.z;

  const pos = new Vector3()
    .copy(perspectiveCamera.position)
    .add(vec.multiplyScalar(factor));
  return pos.setZ(groundHeight.value);
}

export function grow(seeds: Vector3[], bbox: BBox, threshold = 0.05) {
  const inBox: boolean[] = [];
  const center = bbox.getCenter();
  const halfSeedScale = bbox.multiplyScalar(seedArea).getScale().multiplyScalar(1 / 2);
  let iteration = 20000;
  let next = true;
  while (iteration-- && next) {
    next = false;
    seeds.forEach((seed, index) => {
      if (inBox[index]) return;
      if (bbox.contains(seed)) {
        inBox[index] = true;
        return;
      }
      if (seed.z > center.z - halfSeedScale.z) {
        if (bbox.grow(seed, threshold)) {
          next = true;
        }
      }
    });
  }
}
