import {mode} from "@/store/global";
import {MODE} from "@/types/global";
import {resetCamera} from "@/functions/useCamera";

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
    case 'd':
      mode.value = MODE.drag;
      break;
  }
}
