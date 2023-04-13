import {BufferAttribute, BufferGeometry, Vector2, Vector3} from 'three';
import {currentFrame, mode, POINTS} from "@/store/global";
import {MODE} from "@/types/global";
import {perspectiveCamera, perspectiveControl} from "@/functions/useCamera";
import {
  positionWorldDirection
} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";
import {INF} from "@/config/labels";
import {makeCuboid} from "@/functions/useCuboid";
import {SCENE} from "@/functions/useScene";
import {Shape} from "@/cores/annotations";
import {annotationObjects, currentLabel} from "@/store/annotations";
// todo: usage
// todo: select box color
// todo: 新增标注物会导致点云颜色重新绘制？
export function initDragHelper() {
  const element = document.createElement('div');
  element.classList.add('select-box');
  element.style.pointerEvents = 'none';

  const startPoint = new Vector2();
  const pointTopLeft = new Vector2();
  const pointBottomRight = new Vector2();
  let isLeftDown = false;


  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousedown', onDragStart);
  perspective.addEventListener('mousemove', onDragMove);
  perspective.addEventListener('mouseup', onDragOver);

  function onDragStart(event: MouseEvent) {
    if (event.buttons !== 1 || mode.value !== MODE.drag) return;

    element.style.display = 'none';
    perspective.appendChild(element);


    startPoint.x = event.offsetX;
    startPoint.y = event.offsetY;
  }

  function onDragMove(event: MouseEvent) {
    if (event.buttons !== 1 || mode.value !== MODE.drag) return;

    element.style.display = 'block';

    pointBottomRight.x = Math.max(startPoint.x, event.offsetX);
    pointBottomRight.y = Math.max(startPoint.y, event.offsetY);
    pointTopLeft.x = Math.min(startPoint.x, event.offsetX);
    pointTopLeft.y = Math.min(startPoint.y, event.offsetY);

    element.style.left = pointTopLeft.x + 'px';
    element.style.top = pointTopLeft.y + 'px';
    element.style.width = (pointBottomRight.x - pointTopLeft.x) + 'px';
    element.style.height = (pointBottomRight.y - pointTopLeft.y) + 'px';
  }

  function onDragOver(event: MouseEvent) {
    const angle = perspectiveControl.getAzimuthalAngle();
    const axisZ = new Vector3(0, 0, 1);

    if (event.button !== 0 || mode.value !== MODE.drag) return;

    element.parentElement?.removeChild(element);
    const position = POINTS.value.geometry.getAttribute('position') as BufferAttribute;
    const colors = POINTS.value.geometry.getAttribute('color') as BufferAttribute;
    const point = new Vector3();


    const minX = (pointTopLeft.x / perspective.clientWidth) * 2 - 1;
    const minY = -(pointBottomRight.y / perspective.clientHeight) * 2 + 1;
    const maxX = (pointBottomRight.x / perspective.clientWidth) * 2 - 1;
    const maxY = -(pointTopLeft.y / perspective.clientHeight) * 2 + 1;

    let nx = INF;
    let ny = INF;
    let nz = INF;
    let px = -INF;
    let py = -INF;
    let pz = -INF;

    let count = 0;
    for (let i = 0; i < position.count; ++i) {
      point.fromBufferAttribute(position, i);
      point.project(perspectiveCamera);
      if (point.x > minX && point.y > minY && point.x < maxX && point.y < maxY) {
        colors.setX(i, 0);
        point.fromBufferAttribute(position, i);
        point.applyAxisAngle(axisZ, -angle);
        nx = Math.min(nx, point.x);
        ny = Math.min(ny, point.y);
        nz = Math.min(nz, point.z);
        px = Math.max(px, point.x);
        py = Math.max(py, point.y);
        pz = Math.max(pz, point.z);
        count++;
      }
    }
    if (count < 10) return;
    const center = new Vector3((nx + px) / 2, (ny + py) / 2, (nz + pz) / 2);
    const scale = new Vector3(px - nx, py - ny, pz - nz);
    center.applyAxisAngle(axisZ, angle);
    const points = [
      px - nx,
      py - ny,
      pz - nz,
      center.x,
      center.y,
      center.z,
      0,
      0,
      angle
    ];
    const shape = new Shape(currentLabel.value, currentFrame.value, points);
    annotationObjects.push(shape);
    colors.needsUpdate = true;
  }
}



