import {currentFrame, mode, mousePosition} from "@/store/global";
import {MODE} from "@/types/global";
import * as THREE from "three";
import {cuboidTemplate, freeCamera, render} from "@/functions/useCanvas";
import {annotationObjects, currentLabel} from "@/store/annotations";
import {Track, Shape} from "@/cores/annotations";

function updateMousePosition(e: MouseEvent) {
  const freeView = document.getElementById('perspective') as HTMLElement;
  mousePosition.x = (e.offsetX / freeView.clientWidth) * 2 - 1;
  mousePosition.y = -(e.offsetY / freeView.clientHeight) * 2 + 1;
}

export function onPerspectiveViewMouseMove(e: MouseEvent) {
  if (mode.value === MODE.put) {
    updateMousePosition(e);
    setCuboidTemplateToMouse();
    render();
  }
}

export function onPerspectiveViewWheel(e: WheelEvent) {
  if (mode.value === MODE.put) {
    updateMousePosition(e);
    setCuboidTemplateToMouse();
    render();
  }
}

export function onPerspectiveViewClick(e: MouseEvent) {
  if (mode.value === MODE.put) {
    const points: number[] = [
      cuboidTemplate.geometry.parameters.width,
      cuboidTemplate.geometry.parameters.height,
      cuboidTemplate.geometry.parameters.depth,
      cuboidTemplate.position.x,
      cuboidTemplate.position.y,
      cuboidTemplate.position.z,
      cuboidTemplate.rotation.x,
      cuboidTemplate.rotation.x,
      cuboidTemplate.rotation.x,
    ];
    const shape = new Shape(currentLabel.value, currentFrame.value, points);
    annotationObjects.push(shape);
    mode.value = MODE.default;
    render();
  }
}

/**
 * let cuboidTemplate move with mouse position
 */
function setCuboidTemplateToMouse() {
  const vec = new THREE.Vector3(mousePosition.x, mousePosition.y, 0)
    .unproject(freeCamera)
    .sub(freeCamera.position)
    .normalize();

  const factor = -freeCamera.position.z / vec.z;

  const pos = new THREE.Vector3()
    .copy(freeCamera.position)
    .add(vec.multiplyScalar(factor));
  cuboidTemplate.position.set(pos.x, pos.y, 0)
}

