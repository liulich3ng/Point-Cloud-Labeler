import {INF} from "@/config/labels";
import {Vector3} from "three";
import {max} from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

export class BBox {
  maxX;
  minX;
  maxY;
  minY;
  maxZ;
  minZ;
  update = false;

  constructor(maxX: number = -INF, minX: number = INF,
              maxY: number = -INF, minY: number = INF,
              maxZ: number = -INF, minZ: number = INF) {
    this.maxX = maxX;
    this.minX = minX;
    this.maxY = maxY;
    this.minY = minY;
    this.maxZ = maxZ;
    this.minZ = minZ;
  }

  /**
   * grow box to contain the point
   * @param point
   * @param threshold
   */
  grow(point: Vector3, threshold = -1) {
    if (threshold <= 0) {
      if (point.x > this.maxX) this.maxX = point.x; else if (point.x < this.minX) this.minX = point.x;
      if (point.y > this.maxY) this.maxY = point.y; else if (point.y < this.minY) this.minY = point.y;
      if (point.z > this.maxZ) this.maxZ = point.z; else if (point.z < this.minZ) this.minZ = point.z;
    } else {

    }
  }


  getCenter() {
    return new Vector3((this.maxX + this.minX) / 2, (this.maxY + this.minY) / 2, (this.maxZ + this.minZ) / 2);
  }

  getScale() {
    return new Vector3(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
  }

  clone() {
    return new BBox(this.maxX, this.minX, this.maxY, this.minY, this.maxZ, this.minZ);
  }

  multiplyScalar(s: number) {
    const center = this.getCenter();
    const scale = this.getScale().multiplyScalar(s / 2);
    this.maxX = center.x + scale.x;
    this.minX = center.x - scale.x;
    this.maxY = center.y + scale.y;
    this.minY = center.y - scale.y;
    this.maxZ = center.z + scale.z;
    this.minZ = center.z - scale.z;
    return this;
  }
}
