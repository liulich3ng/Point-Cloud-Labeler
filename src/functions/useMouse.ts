import {currentFrame, groundHeight, mode} from "@/store/global";
import {MODE} from "@/types/global";
import {render} from "@/functions/useRender";
import {annotationObjects, currentLabel} from "@/store/annotations";
import {Shape} from "@/cores/annotations";
import {Raycaster, Vector2, Vector3} from "three";
import {drawHelper, SCENE} from "@/functions/useScene";
import {perspectiveCamera, perspectiveControl} from "@/functions/useCamera";

export const raycaster = new Raycaster();
const mouseCurrent = new Vector2();
const mouseBegin = new Vector2();
const mouseBeginToGround = new Vector3();
const mouseEnd = new Vector2();


export function onPerspectiveViewMousemove(e: MouseEvent) {
  computeCurrentMouse(e);
  switch (mode.value) {
    case MODE.default:
      break;
    case MODE.put:
      drawHelper.position.copy(mouseToGround());
      break;
    case MODE.drag:
      break;
  }
  render();
}

export function onPerspectiveViewMousedown(e: MouseEvent) {
  computeCurrentMouse(e);
  switch (mode.value) {
    case MODE.default:
      break;
    case MODE.put:
      break;
    case MODE.drag:
      break;
  }
}

export function onPerspectiveViewMouseup(e: MouseEvent) {

  switch (mode.value) {
    case MODE.default:
      break;
    case MODE.put:
      if (e.button !== 0) return;
      finishDraw();
      mode.value = MODE.default;
      render();
      break;
    case MODE.drag:
      break;
  }
}

export function onPerspectiveViewWheel(e: WheelEvent) {
  if (mode.value === MODE.put) {
    computeCurrentMouse(e);
    drawHelper.position.copy(mouseToGround());
    render();
  }
}

/**
 * let drawHelper move with mouse position
 */
function mouseToGround() {
  const vec = new Vector3(mouseCurrent.x, mouseCurrent.y, 0)
    .unproject(perspectiveCamera)
    .sub(perspectiveCamera.position)
    .normalize();

  const factor = (groundHeight.value - perspectiveCamera.position.z) / vec.z;

  const pos = new Vector3()
    .copy(perspectiveCamera.position)
    .add(vec.multiplyScalar(factor));
  return pos.setZ(groundHeight.value);
}

/**
 * mouse position to camera's normalized device coordinate (NDC)
 * @param e
 */
function computeCurrentMouse(e: MouseEvent) {
  const freeView = document.getElementById('perspective') as HTMLElement;
  mouseCurrent.x = (e.offsetX / freeView.clientWidth) * 2 - 1;
  mouseCurrent.y = -(e.offsetY / freeView.clientHeight) * 2 + 1;
}

function finishDraw() {
  const points: number[] = [
    drawHelper.scale.x,
    drawHelper.scale.y,
    drawHelper.scale.z,
    drawHelper.position.x,
    drawHelper.position.y,
    drawHelper.position.z,
    drawHelper.rotation.x,
    drawHelper.rotation.y,
    drawHelper.rotation.z,
  ];
  const shape = new Shape(currentLabel.value, currentFrame.value, points);
  annotationObjects.push(shape);
}
