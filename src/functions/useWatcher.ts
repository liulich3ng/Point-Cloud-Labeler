import {watch, watchEffect} from "vue";
import {mode} from "@/store/global";
import {MODE} from "@/types/global";
import {drawHelper, makeScene} from "@/functions/useScene";
import {render} from "@/functions/useRender";
import {currentLabelIndex} from "@/store/annotations";
import {labels} from "@/config/labels";
import {LineBasicMaterial, LineSegments} from "three";

export function initWatcher() {
  watchEffect(() => {
    mode.value = MODE.default;
    makeScene();
    render();
  });

  // todo: refactor drawHelper?
  watch(mode, handleModeChange, {immediate: true});
  watch(currentLabelIndex, handleCurrentLabelIndexChange, {immediate: true});
}

function handleModeChange(mode: MODE) {
  if (mode === MODE.default) {
    drawHelper.position.set(Infinity, Infinity, Infinity);
    render();
  } else if (mode === MODE.put) {

  }
}

function handleCurrentLabelIndexChange(index: number) {
  drawHelper.material.color.set(labels[index].color);
  const edges = drawHelper.children[0] as LineSegments;
  (edges.material as LineBasicMaterial).color.set(labels[index].color);
}
