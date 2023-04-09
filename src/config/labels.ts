import {PointCloudLabel} from "@/cores/labels";

export const labels: PointCloudLabel[] = [
  {
    name: 'car',
    color: '#0000ff',
    type: "cuboid",
    attributes: [],
    defaultSize: {x: 4.6, y: 1.7, z: 1.6}
  },
  {
    name: 'bus',
    color: '#ffff00',
    type: "cuboid",
    attributes: [],
    defaultSize: {x: 8, y: 2.6, z: 3}
  },
];
