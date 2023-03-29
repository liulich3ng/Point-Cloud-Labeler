import {currentFrame, mode, mousePosition} from "@/store/item";
import {MODE} from "@/types/draw";
import * as THREE from "three";
import {cuboidTemplate, freeCamera, render} from "@/functions/useCanvas";
import {annotationObjects, currentLabel} from "@/store/annotations";
import {Track, Shape} from "@/cores/annotations";

function updatePickPosition(e: MouseEvent) {
  const freeView = document.getElementById('perspective') as HTMLElement;
  mousePosition.x = (e.offsetX / freeView.clientWidth) * 2 - 1;
  mousePosition.y = -(e.offsetY / freeView.clientHeight) * 2 + 1;
}

export function onPerspectiveViewMouseMove(e: MouseEvent) {
  if (mode.value === MODE.put) {
    updatePickPosition(e);
    const vec = new THREE.Vector3();
    const pos = new THREE.Vector3();
    vec.set(mousePosition.x, mousePosition.y, 0);
    vec.unproject(freeCamera);
    vec.sub(freeCamera.position).normalize();
    const distance = -freeCamera.position.z / vec.z;

    pos.copy(freeCamera.position).add(vec.multiplyScalar(distance));
    cuboidTemplate.position.set(pos.x, pos.y, 0);
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
