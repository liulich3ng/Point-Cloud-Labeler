import {MOUSE, OrthographicCamera, PerspectiveCamera} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {render} from "@/functions/useRender";

export const perspectiveCamera: PerspectiveCamera = new PerspectiveCamera();
export const topCamera: OrthographicCamera = new OrthographicCamera(-1, 1, 1, -1);
export const mainCamera: OrthographicCamera = new OrthographicCamera(-1, 1, 1, -1);
export const leftCamera: OrthographicCamera = new OrthographicCamera(-1, 1, 1, -1);
export let perspectiveControl: OrbitControls;

export function initCamera() {
  perspectiveCamera.position.set(20, 20, 20);
  perspectiveCamera.up.set(0, 0, 1);
  perspectiveCamera.lookAt(0, 0, 0);
  perspectiveControl = new OrbitControls(perspectiveCamera, document.getElementById('perspective')!);
  perspectiveControl.mouseButtons = {
    MIDDLE: MOUSE.PAN,
    RIGHT: MOUSE.ROTATE
  };
  perspectiveControl.maxPolarAngle = Math.PI * 0.5;
  perspectiveControl.addEventListener("change", render);
  perspectiveControl.minDistance = 0.5;
  perspectiveControl.maxDistance = 300;

  topCamera.position.set(0, 0, 100);
  topCamera.up.set(0, 1, 0);
  topCamera.lookAt(0, 0, 0);
  const topControl = new OrbitControls(topCamera, document.getElementById('top')!);
  topControl.enableRotate = false;
  topControl.addEventListener("change", render);
  topControl.minDistance = 0.5;
  topControl.maxDistance = 300;

  mainCamera.position.set(0, 200, 0);
  mainCamera.up.set(0, 0, 1);
  mainCamera.lookAt(0, 0, 0);
  const mainControl = new OrbitControls(mainCamera, document.getElementById('main')!);
  mainControl.enableRotate = false;
  mainControl.addEventListener("change", render);
  mainControl.minDistance = 0.5;
  mainControl.maxDistance = 300;

  leftCamera.position.set(200, 0, 0);
  leftCamera.up.set(0, 0, 1);
  leftCamera.lookAt(0, 0, 0);
  const leftControl = new OrbitControls(leftCamera, document.getElementById('left')!);
  leftControl.enableRotate = false;
  leftControl.addEventListener("change", render);
  leftControl.minDistance = 0.5;
}

export function resetCamera() {
  perspectiveControl.reset();
  render();
}
