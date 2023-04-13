import {mouseToGround} from "@/functions/useMouse";
import {render} from "@/functions/useRender";
import {currentFrame, mode} from "@/store/global";
import {MODE} from "@/types/global";
import {drawHelper} from "@/functions/useScene";
import {Shape} from "@/cores/annotations";
import {annotationObjects, currentLabel} from "@/store/annotations";

export function initPutHelper() {
  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousemove', onwMousemove);
  perspective.addEventListener('mousedown', onMousedown);
  perspective.addEventListener('mouseup', onMouseup);
  perspective.addEventListener('wheel', onPerspectiveViewWheel);

  function onwMousemove(e: MouseEvent) {
    if (mode.value !== MODE.put) return;
    drawHelper.position.copy(mouseToGround(e));
    render();
  }

  function onMousedown(e: MouseEvent) {

  }

  function onMouseup(e: MouseEvent) {
    if (e.button !== 0) return;
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
}

export function onPerspectiveViewWheel(e: WheelEvent) {
  if (mode.value !== MODE.put) return;
  drawHelper.position.copy(mouseToGround(e));
  render();
}
