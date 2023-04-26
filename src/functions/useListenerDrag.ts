import {BufferAttribute, Vector2, Vector3} from 'three';
import {currentFrame, mode, pointCloud} from "@/store/global";
import {MODE} from "@/types/global";
import {perspectiveCamera, perspectiveControl} from "@/functions/useCamera";
import {Annotation} from "@/cores/Annotations";
import {annotationObjects, currentLabel} from "@/store/annotations";
import {BBox} from "@/cores/BBox";
import {grow} from "@/functions/useMath";
// todo: select box color
// todo: 新增标注物会导致点云颜色重新绘制？
export function initDragListener() {
  const element = document.createElement('div');
  element.classList.add('select-box');
  element.style.pointerEvents = 'none';

  const startPoint = new Vector2();
  const pointTopLeft = new Vector2();
  const pointBottomRight = new Vector2();

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
    if (event.button !== 0 || mode.value !== MODE.drag) return;

    const angle = perspectiveControl.getAzimuthalAngle();
    const axisZ = new Vector3(0, 0, 1);

    element.parentElement?.removeChild(element);
    const position = pointCloud.value.geometry.getAttribute('position') as BufferAttribute;
    const point = new Vector3();

    const minX = (pointTopLeft.x / perspective.clientWidth) * 2 - 1;
    const minY = -(pointBottomRight.y / perspective.clientHeight) * 2 + 1;
    const maxX = (pointBottomRight.x / perspective.clientWidth) * 2 - 1;
    const maxY = -(pointTopLeft.y / perspective.clientHeight) * 2 + 1;

    const bbox = new BBox();

    const selectedPoints = [];
    for (let i = 0; i < position.count; ++i) {
      point.fromBufferAttribute(position, i).project(perspectiveCamera);
      if (point.x > minX && point.y > minY && point.x < maxX && point.y < maxY) {
        selectedPoints.push(point.fromBufferAttribute(position, i).applyAxisAngle(axisZ, -angle).clone());
        bbox.grow(point);
      }
    }
    if (selectedPoints.length < 10) return;
    let center = bbox.getCenter();
    grow(selectedPoints, bbox,0.05*center.length());
    center = bbox.getCenter();
    const scale = bbox.getScale();
    center.applyAxisAngle(axisZ, angle);
    const points = [
      scale.x,
      scale.y,
      scale.z,
      center.x,
      center.y,
      center.z,
      0,
      0,
      angle
    ];
    const shape = new Annotation(currentLabel.value, currentFrame.value, points);
    annotationObjects.push(shape);
  }
}



