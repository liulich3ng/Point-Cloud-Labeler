import {currentFrame, mode, mousePosition} from "@/store/global";
import {MODE} from "@/types/global";
import {render} from "@/functions/useRender";
import {annotationObjects, currentLabel} from "@/store/annotations";
import {Shape} from "@/cores/annotations";
import {Raycaster, Vector3} from "three";
import {drawHelper, SCENE} from "@/functions/useScene";
import {perspectiveCamera} from "@/functions/useCamera";

const raycaster = new Raycaster();

function updateMousePosition(e: MouseEvent) {
  const freeView = document.getElementById('perspective') as HTMLElement;
  mousePosition.x = (e.offsetX / freeView.clientWidth) * 2 - 1;
  mousePosition.y = -(e.offsetY / freeView.clientHeight) * 2 + 1;
}

export function onPerspectiveViewMouseMove(e: MouseEvent) {
  if (mode.value === MODE.put) {
    updateMousePosition(e);
    moveToMousePosition();
    render();
  } else if (mode.value === MODE.default) {
    updateMousePosition(e);
    raycaster.setFromCamera(mousePosition, perspectiveCamera);
    const intersectObjects = raycaster.intersectObjects(SCENE.children, false);

    // console.log(scene)
  }
}

export function onPerspectiveViewWheel(e: WheelEvent) {
  if (mode.value === MODE.put) {
    updateMousePosition(e);
    moveToMousePosition();
    render();
  }
}

export function onPerspectiveViewClick(e: MouseEvent) {
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
  }
}

/**
 * let drawHelper move with mouse position
 */
function moveToMousePosition() {
  const vec = new Vector3(mousePosition.x, mousePosition.y, 0)
    .unproject(perspectiveCamera)
    .sub(perspectiveCamera.position)
    .normalize();

  const factor = -perspectiveCamera.position.z / vec.z;

  const pos = new Vector3()
    .copy(perspectiveCamera.position)
    .add(vec.multiplyScalar(factor));
  drawHelper.position.set(pos.x, pos.y, 0);
}

