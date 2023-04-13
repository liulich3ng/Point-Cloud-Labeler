import {onKeyDown} from "@/functions/useKeyboard";
import {render} from "@/functions/useRender";
import {computeCurrentMouse} from "@/functions/useMouse";

export function initEventListeners() {
  window.addEventListener('resize', render, false);

  const perspective = document.getElementById('perspective') as HTMLElement;
  perspective.addEventListener('mousemove', onMousemove);
  perspective.addEventListener('mousedown', onMousedown);
  perspective.addEventListener('mouseup', onMouseup);

  document.addEventListener('keydown', onKeyDown);

  function onMousemove(e: MouseEvent) {
    computeCurrentMouse(e);
  }

  function onMousedown(e: MouseEvent){

  }

  function onMouseup(e:MouseEvent){

  }
}
