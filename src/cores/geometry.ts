import {INF} from "@/config/labels";
import {Vector3} from "three";

export class BBox {
  maxX = -INF;
  minX = INF;
  maxY = -INF;
  minY = INF;
  maxZ = -INF;
  minZ = INF;

  /**
   * grow box to contain the point
   * @param point
   */
  grow(point: Vector3) {
    if (point.x > this.maxX) this.maxX = point.x; else if (point.x < this.minX) this.minX = point.x;
    if (point.y > this.maxY) this.maxY = point.y; else if (point.y < this.minY) this.minY = point.y;
    if (point.z > this.maxZ) this.maxZ = point.z; else if (point.z < this.minZ) this.minZ = point.z;
  }

  getCenter() {
    return new Vector3((this.maxX + this.minX) / 2, (this.maxY + this.minY) / 2, (this.maxZ + this.minZ) / 2);
  }

  getScale() {
    return new Vector3(this.maxX - this.minX, this.maxY - this.minY, this.maxZ - this.minZ);
  }
}
