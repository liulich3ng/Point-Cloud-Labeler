import {mode} from "@/store/item";
import {MODE} from "@/types/draw";
import {resetCamera} from "@/functions/useCanvas";

export function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape':
      mode.value = MODE.default;
      break;
    case 'a':
      mode.value = MODE.put;
      break;
    case 'r':
      resetCamera();
      break;
  }
}
