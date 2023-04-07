import {
  onPerspectiveViewClick,
  onPerspectiveViewMouseMove,
  onPerspectiveViewWheel
} from "@/functions/useMouse";
import {onKeyDown} from "@/functions/useKeyboard";
import {render} from "@/functions/useRender";

export function initEventListeners() {
  window.addEventListener('resize', render, false);

  const perspective = document.getElementById('perspective') as HTMLCanvasElement;
  perspective.addEventListener('mousemove', onPerspectiveViewMouseMove);
  perspective.addEventListener('wheel', onPerspectiveViewWheel);
  perspective.addEventListener('click', onPerspectiveViewClick);

  document.addEventListener('keydown', onKeyDown);
}
