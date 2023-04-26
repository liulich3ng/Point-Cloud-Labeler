export interface Attribute {
  readonly name: string;
  readonly mutable: boolean;
  readonly input_type: AttrInputType;
  readonly default_value: string;
  values: string[];
}

export interface Label {
  readonly name: string;
  readonly color: string;
  readonly type: LabelType;
  attributes: Attribute[];
}

export interface PointCloudLabel extends Label {
  defaultSize: { x: number, y: number, z: number };
}

export type LabelType =
  'rectangle'
  | 'polygon'
  | 'polyline'
  | 'points'
  | 'ellipse'
  | 'cuboid'
  | 'skeleton'
  | 'mask'
  | 'tag'
  | 'any';
export type AttrInputType = 'select' | 'radio' | 'checkbox' | 'number' | 'text';

export enum ShapeType {
  RECTANGLE = 'rectangle',
  POLYGON = 'polygon',
  POLYLINE = 'polyline',
  POINTS = 'points',
  ELLIPSE = 'ellipse',
  CUBOID = 'cuboid',
  SKELETON = 'skeleton',
  MASK = 'mask',
}
