import {watch, watchEffect} from "vue";
import {mode} from "@/store/global";
import {MODE} from "@/types/global";
import {cuboidHelper, makeScene} from "@/functions/useScene";
import {render} from "@/functions/useRender";
import {currentLabel, } from "@/store/annotations";
import {LineBasicMaterial, LineSegments} from "three";
import {INF} from "@/config/labels";

export function initWatcher() {
  watchEffect(() => {
    mode.value = MODE.default;
    makeScene();
    render();
  });

  watchEffect(resetDrawHelper);
}

function resetDrawHelper() {
  // todo: refactor drawHelper to a singleton class?
  cuboidHelper.material.color.set(currentLabel.value.color);
  const edges = cuboidHelper.children[0] as LineSegments;
  (edges.material as LineBasicMaterial).color.set(currentLabel.value.color);
  const {x, y, z} = currentLabel.value.defaultSize;
  cuboidHelper.scale.set(x, y, z);
  cuboidHelper.rotation.set(0, 0, 0);
  switch (mode.value) {
    case MODE.default:
      cuboidHelper.position.set(INF, INF, INF);
      render();
      break;
    case MODE.put:
      break;
    case MODE.drag:
      break;
  }
}
