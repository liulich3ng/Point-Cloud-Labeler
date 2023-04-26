import {groundHeight, seedArea} from "@/store/global";
import {Euler, Quaternion, Raycaster, Vector2, Vector3} from "three";
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

export function interpolate(points1: number[], points2: number[], alpha: number) {
  const res: number[] = [];
  for (let i = 0; i < 9; ++i) {
    res.push(points1[i] + alpha * (points2[i] - points1[1]));
  }
  // using quaternion avoid gimbal lock
  const q1 = new Quaternion().setFromEuler(new Euler(points1[3], points1[4], points1[5]));
  const q2 = new Quaternion().setFromEuler(new Euler(points2[3], points2[4], points2[5]));
  q1.slerp(q2,alpha);
  const e = new Euler().setFromQuaternion(q1);
  res[4] = e.x;
  res[5] = e.y;
  res[6] = e.z;
  return res;
}

const q1 = new Quaternion(1, 1, 1, Math.PI / 2);
const q2 = new Quaternion(0, 0, 0, Math.PI / 2);
console.log(q1);
q1.setFromEuler(new Euler(1, 1, 0));
q2.setFromEuler(new Euler(0, 0, 0));
console.log(q1);
q1.slerp(q2, 0.2);
console.log(q1);
console.log(new Euler().setFromQuaternion(q1));


