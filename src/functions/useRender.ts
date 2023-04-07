import * as THREE from "three";
import {
  Camera,
  PerspectiveCamera,
  WebGLRenderer
} from "three";
import {SCENE} from "@/functions/useScene";
import {
  leftCamera,
  mainCamera,
  perspectiveCamera,
  topCamera
} from "@/functions/useCamera";

let renderer: WebGLRenderer;

export function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    alpha: true
  });
}

export function render() {
  function updateSize() {
    const pixelRatio = window.devicePixelRatio;
    const canvas = renderer.domElement;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    if (canvas.width !== width || canvas.height !== height) {
      renderer.setSize(width, height, false);
    }
  }

  function renderView(view: string, camera: Camera) {
    const rect1 = document.getElementById(view)!.getBoundingClientRect();
    const rect2 = document.getElementById('canvas')!.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio;
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = rect1.width / rect1.height;
      camera.updateProjectionMatrix();
    }
    const x = (rect1.left - rect2.left) * pixelRatio;
    const y = (rect2.bottom - rect1.bottom) * pixelRatio;
    const width = rect1.width * pixelRatio;
    const height = rect1.height * pixelRatio;
    renderer.setViewport(x, y, width, height);
    renderer.setScissor(x, y, width, height);
    renderer.setScissorTest(true);
    renderer.render(SCENE, camera);
  }

  updateSize();
  renderView('perspective', perspectiveCamera);
  renderView('top', topCamera);
  renderView('main', mainCamera);
  renderView('left', leftCamera);
}
