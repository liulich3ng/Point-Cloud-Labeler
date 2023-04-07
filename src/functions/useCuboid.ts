import {
  BoxGeometry,
  EdgesGeometry,
  LineBasicMaterial, LineSegments,
  Mesh,
  MeshBasicMaterial
} from "three";

/**
 *
 * @param points [scale, position, rotation]
 * @param color
 */
export function makeCuboid(points: number[] = [1, 1, 1, 0, 0, 0, 0, 0, 0], color = '#0000FF') {
  const geometry = new BoxGeometry(points[0], points[1], points[2]);
  const material = new MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.4
  })
  const cube = new Mesh(geometry, material);
  const edgesGeometry = new EdgesGeometry(geometry);
  const edgesMaterial = new LineBasicMaterial({color: color});
  const edges = new LineSegments(edgesGeometry, edgesMaterial);
  cube.add(edges);
  cube.position.set(points[3], points[4], points[5]);
  cube.rotation.set(points[6], points[7], points[8]);
  return cube;
}
