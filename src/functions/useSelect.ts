import {Vector2} from 'three';

export function initSelectHelper() {
  const element = document.createElement('div');
  element.classList.add('select-box');
  element.style.pointerEvents = 'none';

  const startPoint = new Vector2();
  const pointTopLeft = new Vector2();
  const pointBottomRight = new Vector2();
  let isLeftDown = false;


  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousedown', onSelectStart);
  perspective.addEventListener('mousemove', onSelectMove);
  perspective.addEventListener('mouseup', onSelectOver);

  function onSelectStart(event: MouseEvent) {
    if (event.buttons !== 1) return;
    isLeftDown = true;
    element.style.display = 'none';
    perspective.appendChild(element);


    startPoint.x = event.clientX;
    startPoint.y = event.clientY;
  }

  function onSelectMove(event: MouseEvent) {
    if (event.buttons !== 1) return;

    element.style.display = 'block';

    pointBottomRight.x = Math.max(startPoint.x, event.clientX);
    pointBottomRight.y = Math.max(startPoint.y, event.clientY);
    pointTopLeft.x = Math.min(startPoint.x, event.clientX);
    pointTopLeft.y = Math.min(startPoint.y, event.clientY);

    element.style.left = pointTopLeft.x + 'px';
    element.style.top = pointTopLeft.y + 'px';
    element.style.width = (pointBottomRight.x - pointTopLeft.x) + 'px';
    element.style.height = (pointBottomRight.y - pointTopLeft.y) + 'px';
  }

  function onSelectOver() {
    isLeftDown = false;
    element.parentElement?.removeChild(element);
  }
}



