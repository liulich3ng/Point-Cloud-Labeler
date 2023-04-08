import {
  onPerspectiveViewMousedown,
  onPerspectiveViewMousemove,
  onPerspectiveViewMouseup,
  onPerspectiveViewWheel
} from "@/functions/useMouse";
import {onKeyDown} from "@/functions/useKeyboard";
import {render} from "@/functions/useRender";

export function initEventListeners() {
  window.addEventListener('resize', render, false);

  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousemove', onPerspectiveViewMousemove);
  perspective.addEventListener('mousedown', onPerspectiveViewMousedown);
  perspective.addEventListener('mouseup', onPerspectiveViewMouseup);
  perspective.addEventListener('wheel', onPerspectiveViewWheel);

  document.addEventListener('keydown', onKeyDown);
}
