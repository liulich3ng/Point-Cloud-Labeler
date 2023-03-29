export interface PCDHeader {
  headerLen: number,
  data: string,
  str: string,
  version: number,
  fields: string[],
  type: string[],
  width: number,
  height: number,
  points: number,
  viewpoint: string,
  size: number[],
  count: number[],
  rowSize: number,
  offset: any,
}

export interface PCDData {
  url: string,
  header: PCDHeader,
  position: Float32Array,
  color: Float32Array,
  normal: Float32Array,
  intensity: Float32Array,
  label: Float32Array,
}
