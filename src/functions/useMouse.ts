import {currentFrame, mode} from "@/store/global";
import {MODE} from "@/types/global";
import {render} from "@/functions/useRender";
import {annotationObjects, currentLabel} from "@/store/annotations";
import {Shape} from "@/cores/annotations";
import {Raycaster, Vector2, Vector3} from "three";
import {drawHelper} from "@/functions/useScene";
import {perspectiveCamera} from "@/functions/useCamera";

const raycaster = new Raycaster();
const mouseCurrent = new Vector2();
const mouseBegin = new Vector2();
const mouseEnd = new Vector2();


export function onPerspectiveViewMousemove(e: MouseEvent) {
  if (mode.value === MODE.default) {
    computeCurrentMouse(e);
    // raycaster.setFromCamera(mouseCurrent, perspectiveCamera);
    // const intersectObjects = raycaster.intersectObject(POINTS.value, false);
    // if (intersectObjects.length > 0) {
    //   render();
    // } else {
    //
    // }
  } else if (mode.value === MODE.put) {
    computeCurrentMouse(e);
    moveToMousePosition();
    render();
  } else if (mode.value === MODE.drag) {

  }
}

export function onPerspectiveViewMousedown(e: MouseEvent) {
  if (mode.value === MODE.put) {
    const points: number[] = [
      drawHelper.geometry.parameters.width,
      drawHelper.geometry.parameters.height,
      drawHelper.geometry.parameters.depth,
      drawHelper.position.x,
      drawHelper.position.y,
      drawHelper.position.z,
      drawHelper.rotation.x,
      drawHelper.rotation.x,
      drawHelper.rotation.x,
    ];
    const shape = new Shape(currentLabel.value, currentFrame.value, points);
    annotationObjects.push(shape);
    mode.value = MODE.default;
    render();
  } else if (mode.value === MODE.drag) {

  }
}

export function onPerspectiveViewMouseup(e: MouseEvent) {
  if (mode.value === MODE.drag) {

  }
}

export function onPerspectiveViewWheel(e: WheelEvent) {
  if (mode.value === MODE.put) {
    computeCurrentMouse(e);
    moveToMousePosition();
    render();
  }
}

/**
 * let drawHelper move with mouse position
 */
function moveToMousePosition() {
  const vec = new Vector3(mouseCurrent.x, mouseCurrent.y, 0)
    .unproject(perspectiveCamera)
    .sub(perspectiveCamera.position)
    .normalize();

  const factor = -perspectiveCamera.position.z / vec.z;

  const pos = new Vector3()
    .copy(perspectiveCamera.position)
    .add(vec.multiplyScalar(factor));
  drawHelper.position.set(pos.x, pos.y, 0);
}

function computeCurrentMouse(e: MouseEvent) {
  const freeView = document.getElementById('perspective') as HTMLElement;
  mouseCurrent.x = (e.offsetX / freeView.clientWidth) * 2 - 1;
  mouseCurrent.y = -(e.offsetY / freeView.clientHeight) * 2 + 1;
}
