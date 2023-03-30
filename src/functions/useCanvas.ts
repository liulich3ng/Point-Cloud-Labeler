import * as THREE from "three";
import {
  BoxGeometry,
  BufferGeometry,
  Camera,
  EdgesGeometry,
  Float32BufferAttribute,
  Int32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer
} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {watch, watchEffect} from "vue";
import {currentFrame, mode, pcdDataCache} from "@/store/item";
import {PCDData} from "@/types/pcd";
import {MODE} from "@/types/draw";
import {
  onPerspectiveViewClick,
  onPerspectiveViewMouseMove
} from "@/functions/useMouse";
import {
  annotationObjects,
  currentLabel,
  currentLabelIndex
} from "@/store/annotations";
import {labels} from "@/config/labels";
import {Shape} from "@/cores/annotations";
import {Label} from "@/cores/labels";
import {onKeyDown} from "@/functions/useKeyboard";

const INF = 100000;
let renderer: WebGLRenderer;
let scene: Scene;
let rayCaster;
export let freeCamera: PerspectiveCamera;
let topCamera: OrthographicCamera;
let mainCamera: OrthographicCamera;
let leftCamera: OrthographicCamera;
let freeControl: OrbitControls;
export const cuboidTemplate = makeCuboid();


export function initCanvas() {
  initRenderer();
  initEventListeners();
  watchEffect(makeScene);

  watch(mode, handleModeChange, {immediate: true});
  watch(currentLabelIndex, handleCurrentLabelIndexChange, {immediate: true});
}

function makeScene() {
  if (pcdDataCache[currentFrame.value]) {
    mode.value = MODE.default;
    scene.clear();

    const points = makePoints(pcdDataCache[currentFrame.value]);
    scene.add(points);

    scene.add(new THREE.AxesHelper(10));

    scene.add(cuboidTemplate);
    console.log(cuboidTemplate)

    annotationObjects.forEach((annotation, index) => {
      if (annotation instanceof Shape && annotation.frameNumber === currentFrame.value) {
        const cuboid = makeCuboid(annotation.points, annotation.label);
        scene.add(cuboid);
      }
    })

    render();
  }
}

function handleModeChange(mode: MODE) {
  if (mode === MODE.default) {
    cuboidTemplate.position.set(INF, INF, INF);
    render();
  } else if (mode === MODE.put) {

  }
}

function handleCurrentLabelIndexChange(index: number) {
  cuboidTemplate.material.color.set(labels[index].color);
  const edges = cuboidTemplate.children[0] as LineSegments;
  (edges.material as LineBasicMaterial).color.set(labels[index].color);
}

function initEventListeners() {
  window.addEventListener('resize', render, false);

  const perspective = document.getElementById('perspective') as HTMLCanvasElement;
  perspective.addEventListener('mousemove', onPerspectiveViewMouseMove);
  perspective.addEventListener('click', onPerspectiveViewClick);

  document.addEventListener('keydown', onKeyDown);
}

function initRenderer() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  scene = new THREE.Scene();

  freeCamera = new PerspectiveCamera();
  freeCamera.position.set(100, 100, 100);
  freeCamera.up.set(0, 0, 1);
  freeCamera.lookAt(0, 0, 0);
  freeControl = new OrbitControls(freeCamera, document.getElementById('perspective')!);
  freeControl.maxPolarAngle = Math.PI * 0.5;
  freeControl.addEventListener("change", render);
  freeControl.minDistance = 0.5;
  freeControl.maxDistance = 300;

  topCamera = new OrthographicCamera(-1, 1, 1, -1);
  topCamera.position.set(0, 0, 100);
  topCamera.up.set(0, 1, 0);
  topCamera.lookAt(0, 0, 0);
  const topControl = new OrbitControls(topCamera, document.getElementById('top')!);
  topControl.enableRotate = false;
  topControl.addEventListener("change", render);
  topControl.minDistance = 0.5;
  topControl.maxDistance = 300;

  mainCamera = new OrthographicCamera(-1, 1, 1, -1);
  mainCamera.position.set(0, 200, 0);
  mainCamera.up.set(0, 0, 1);
  mainCamera.lookAt(0, 0, 0);
  const mainControl = new OrbitControls(mainCamera, document.getElementById('main')!);
  mainControl.enableRotate = false;
  mainControl.addEventListener("change", render);
  mainControl.minDistance = 0.5;
  mainControl.maxDistance = 300;

  leftCamera = new OrthographicCamera(-1, 1, 1, -1);
  leftCamera.position.set(200, 0, 0);
  leftCamera.up.set(0, 0, 1);
  leftCamera.lookAt(0, 0, 0);
  const leftControl = new OrbitControls(leftCamera, document.getElementById('left')!);
  leftControl.enableRotate = false;
  leftControl.addEventListener("change", render);
  leftControl.minDistance = 0.5;
  leftControl.maxDistance = 300;
}

export function render() {
  updateSize();
  renderView('perspective', freeCamera);
  renderView('top', topCamera);
  renderView('main', mainCamera);
  renderView('left', leftCamera);
}

function renderView(view: string, camera: Camera) {
  const rect1 = document.getElementById(view)!.getBoundingClientRect();
  const rect2 = document.getElementById('canvas')!.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio;
  if (camera instanceof PerspectiveCamera) {
    camera.aspect = rect1.width / rect1.height;
    camera.updateProjectionMatrix();
  }
  renderer.setViewport((rect1.left - rect2.left) * pixelRatio, (rect2.bottom - rect1.bottom) * pixelRatio, rect1.width * pixelRatio, rect1.height * pixelRatio);
  renderer.setScissor((rect1.left - rect2.left) * pixelRatio, (rect2.bottom - rect1.bottom) * pixelRatio, rect1.width * pixelRatio, rect1.height * pixelRatio);
  renderer.setScissorTest(true);
  renderer.render(scene, camera);
}

export function makePoints(data: PCDData) {
  const {
    position,
    normal,
    color,
    intensity,
    label
  } = data;
  const geometry = new BufferGeometry();
  if (position.length > 0)
    geometry.setAttribute("position", new Float32BufferAttribute(position, 3));
  if (normal.length > 0)
    geometry.setAttribute("normal", new Float32BufferAttribute(normal, 3));
  if (color.length > 0)
    geometry.setAttribute("color", new Float32BufferAttribute(color, 3));
  if (intensity.length > 0)
    geometry.setAttribute("intensity", new Float32BufferAttribute(intensity, 1));
  if (label.length > 0)
    geometry.setAttribute("label", new Int32BufferAttribute(label, 1));
  geometry.computeBoundingSphere();
  const material = new PointsMaterial({size: 0.005});
  if (color.length > 0) {
    material.vertexColors = true;
  }
  return new Points(geometry, material);
}

function updateSize() {
  const pixelRatio = window.devicePixelRatio;
  const canvas = renderer.domElement;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function makeCuboid(points: number[] = [1, 1, 1, INF, INF, INF, 0, 0, 0], label: Label = currentLabel.value) {
  const geometry = new BoxGeometry(points[0], points[1], points[2]);
  const material = new MeshBasicMaterial({
    color: label.color,
    transparent: true,
    opacity: 0.4
  })
  const cube = new Mesh(geometry, material);
  const edgesGeometry = new EdgesGeometry(geometry);
  const edgesMaterial = new LineBasicMaterial({color: label.color});
  const edges = new LineSegments(edgesGeometry, edgesMaterial);
  cube.add(edges);
  cube.position.set(points[3], points[4], points[5]);
  cube.rotation.set(points[6], points[7], points[8]);
  return cube;
}

export function resetCamera() {
  freeControl.reset();
  render();
}
