import {computeCurrentMouse, mouseNDC, raycaster} from "@/functions/useMath";
import {perspectiveCamera} from "@/functions/useCamera";
import {mode, pointCloud} from "@/store/global";
import {MODE} from "@/types/global";
import {ANNOTATIONS, dotHelper, SCENE} from "@/functions/useScene";
import {BufferAttribute, Points, Vector3} from "three";
import {render} from "@/functions/useRender";
import {INF} from "@/config/labels";

export function initDefaultListeners() {
  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousemove', onMousemove);
  perspective.addEventListener('mousedown', onMousedown);
  perspective.addEventListener('mouseup', onMouseup);

  function onMousemove(e: MouseEvent) {
    computeCurrentMouse(e);
    if (mode.value !== MODE.default) return;
    raycaster.setFromCamera(mouseNDC, perspectiveCamera);
    raycaster.params = {Points: {threshold: 0.1}, Line: {threshold: 0}};
    const intersected = raycaster.intersectObject(ANNOTATIONS, true);
    if (intersected.length > 0) {
      const INTERSECTED = intersected[0];
      if (INTERSECTED.object.type === 'Points') {
        dotHelper.position.copy(new Vector3().fromBufferAttribute(
          pointCloud.value.geometry.getAttribute('position') as BufferAttribute,
          INTERSECTED.index as number));
      } else if (INTERSECTED.object.type === 'Mesh') {
        console.log(INTERSECTED.object);
      }
    } else {
      dotHelper.position.set(INF, INF, INF);
    }
    render();
  }

  function onMousedown(e: MouseEvent) {
  }

  function onMouseup(e: MouseEvent) {

  }
}
