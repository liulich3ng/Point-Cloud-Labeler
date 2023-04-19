import {mouseToGround} from "@/functions/useMath";
import {render} from "@/functions/useRender";
import {currentFrame, mode} from "@/store/global";
import {MODE} from "@/types/global";
import {cuboidHelper} from "@/functions/useScene";
import {Annotation} from "@/cores/annotations";
import {annotationObjects, currentLabel} from "@/store/annotations";

export function initPutListener() {
  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousemove', onwMousemove);
  perspective.addEventListener('mousedown', onMousedown);
  perspective.addEventListener('mouseup', onMouseup);
  perspective.addEventListener('wheel', onPerspectiveViewWheel);

  function onwMousemove(e: MouseEvent) {
    if (mode.value !== MODE.put) return;
    cuboidHelper.position.copy(mouseToGround(e));
    render();
  }

  function onMousedown(e: MouseEvent) {

  }

  function onMouseup(e: MouseEvent) {
    if (e.button !== 0 || mode.value !== MODE.put) return;
    const points: number[] = [
      cuboidHelper.scale.x,
      cuboidHelper.scale.y,
      cuboidHelper.scale.z,
      cuboidHelper.position.x,
      cuboidHelper.position.y,
      cuboidHelper.position.z,
      cuboidHelper.rotation.x,
      cuboidHelper.rotation.y,
      cuboidHelper.rotation.z,
    ];
    const shape = new Annotation(currentLabel.value, currentFrame.value, points);
    annotationObjects.push(shape);
  }
}

export function onPerspectiveViewWheel(e: WheelEvent) {
  if (mode.value !== MODE.put) return;
  cuboidHelper.position.copy(mouseToGround(e));
  render();
}
