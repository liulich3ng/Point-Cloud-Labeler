import {PCDData, PCDHeader} from "@/types/pcd";
import {items, POINTS, PointsRecord} from "@/store/global";
import {
  BufferAttribute,
  BufferGeometry,
  Float32BufferAttribute,
  Int32BufferAttribute, Mesh, Object3D,
  Points,
  PointsMaterial, Vector3
} from "three";
import {raycaster} from "@/functions/useMouse";
import {drawHelper} from "@/functions/useScene";


const DB = 'PCDDatabase';
const TABLE = 'pcd';

export function loadPCD() {
  window.indexedDB.open(DB).onupgradeneeded = function (e) {
    const target = e.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore(TABLE, {keyPath: 'url'});
  };

  window.indexedDB.open(DB).onsuccess = function (e) {
    const target = e.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(TABLE, 'readonly');
    for (let index in items.urls) {
      const url = items.urls[index];
      const request = transaction.objectStore(TABLE).get(url);
      request.onsuccess = () => {
        if (request.result) {
          PointsRecord[index] = makePoints(request.result);
        } else {
          // otherwise load from remote
          loadPCDFromRemote(url).then(data => {
            PointsRecord[index] = makePoints(data);
            const transaction = db.transaction(TABLE, 'readwrite');
            transaction.objectStore(TABLE).add(data);
          }).catch(e => {
            console.error(e);
          });
        }
      };
    }
  };
}

function loadPCDFromRemote(url: string) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      const result = parse(data);
      result.url = url;
      return result;
    });
}

// cost ~50ms for ~5MB file
function parse(data: ArrayBuffer): PCDData {
  const text = new TextDecoder().decode(data);
  const header = parseHeader(text);
  const position = [];
  const color = [];
  const normal = [];
  const intensity = [];
  const label = [];
  if (header.data === 'ascii') {

  } else if (header.data === 'binary') {
    const dataView = new DataView(data, header.headerLen);
    const offset = header.offset;
    for (
      let i = 0, row = 0;
      i < header.points;
      i++, row += header.rowSize
    ) {
      if (offset.x !== undefined) {
        position.push(dataView.getFloat32(row + offset.x, true));
        position.push(dataView.getFloat32(row + offset.y, true));
        position.push(dataView.getFloat32(row + offset.z, true));
      }

      if (offset.rgb !== undefined) {
        color.push(dataView.getUint8(row + offset.rgb + 2) / 255.0);
        color.push(dataView.getUint8(row + offset.rgb + 1) / 255.0);
        color.push(dataView.getUint8(row + offset.rgb + 0) / 255.0);
      }

      if (offset.normal_x !== undefined) {
        normal.push(dataView.getFloat32(row + offset.normal_x, true));
        normal.push(dataView.getFloat32(row + offset.normal_y, true));
        normal.push(dataView.getFloat32(row + offset.normal_z, true));
      }

      if (offset.intensity !== undefined) {
        intensity.push(dataView.getFloat32(row + offset.intensity, true));
      }

      if (offset.label !== undefined) {
        label.push(dataView.getInt32(row + offset.label, true));
      }
    }
  }
  return {
    url: '',
    position: new Float32Array(position),
    color: new Float32Array(color),
    normal: new Float32Array(normal),
    intensity: new Float32Array(intensity),
    label: new Float32Array(label)
  };
}

function parseHeader(data: string) {
  const header: PCDHeader = {
    headerLen: 0,
    data: '',
    str: '',
    version: 0,
    fields: [] as string[],
    type: [] as string[],
    width: 0,
    height: 0,
    points: 0,
    viewpoint: '',
    size: [] as number[],
    count: [] as number[],
    rowSize: 0,
    offset: {} as any,
  };
  const dataLine = data.match(/[\r\n]DATA\s(\S*)\s/i) as RegExpMatchArray;
  header.headerLen = dataLine.index as number + dataLine[0].length;
  // remove comments
  header.str = data.slice(0, header.headerLen).replace(/#.*/gi, "");
  header.data = dataLine[1];
  let tmp;
  if ((tmp = /VERSION (.*)/i.exec(header.str))) header.version = parseFloat(tmp[1]);
  if ((tmp = /FIELDS (.*)/i.exec(header.str))) header.fields = tmp[1].split(' ');
  if ((tmp = /TYPE (.*)/i.exec(header.str))) header.type = tmp[1].split(' ');
  if ((tmp = /WIDTH (.*)/i.exec(header.str))) header.width = parseInt(tmp[1]);
  if ((tmp = /HEIGHT (.*)/i.exec(header.str))) header.height = parseInt(tmp[1]);
  if ((tmp = /POINTS (.*)/i.exec(header.str)))
    header.points = parseInt(tmp[1], 10);
  else
    header.points = header.width * header.height;

  if ((tmp = /VIEWPOINT (.*)/i.exec(header.str))) header.viewpoint = tmp[1];
  if ((tmp = /SIZE (.*)/i.exec(header.str))) header.size = tmp[1].split(' ').map(x => parseInt(x, 10));
  if ((tmp = /COUNT (.*)/i.exec(header.str)))
    header.count = tmp[1].split(' ').map(x => parseInt(x, 10));
  else
    header.count = header.fields.map(() => 1);

  let sizeSum = 0;

  for (let i = 0, l = header.fields.length; i < l; i++) {
    if (header.data === "ascii") {
      header.offset[header.fields[i]] = i;
    } else {
      header.offset[header.fields[i]] = sizeSum;
      sizeSum += header.size[i] * header.count[i];
    }
  }
  // for binary only
  header.rowSize = sizeSum;

  return header;
}

function makePoints(data: PCDData) {
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
  if (color.length > 0) {
    geometry.setAttribute("color", new Float32BufferAttribute(color, 3));
  } else {
    geometry.setAttribute("color", new Float32BufferAttribute(new Array(position.length).fill(1), 3));
  }
  if (intensity.length > 0)
    geometry.setAttribute("intensity", new Float32BufferAttribute(intensity, 1));
  if (label.length > 0)
    geometry.setAttribute("label", new Int32BufferAttribute(label, 1));
  geometry.computeBoundingSphere();
  const material = new PointsMaterial({
    size: 0.005,
    vertexColors: true,
  });

  const points = new Points(geometry, material);
  return points;
}

export function getPointsInBoxBF(box: Object3D) {
  const time = Date.now();
  let count = 0;
  const positions = POINTS.value.geometry.getAttribute("position") as BufferAttribute;
  const corner1 = new Vector3(-Infinity, -Infinity, -Infinity);
  const corner2 = new Vector3(Infinity, Infinity, Infinity);
  for (let i = 0; i < positions.count; ++i) {
    const x = positions.array[i * 3];
    const y = positions.array[i * 3 + 1];
    const z = positions.array[i * 3 + 2];
    const local = box.worldToLocal(new Vector3(x, y, z));
    if (Math.abs(local.x) < box.scale.x / 2
      && Math.abs(local.y) < box.scale.y / 2
      && Math.abs(local.z) < box.scale.z / 2) {
      count++;
      if (local.x > corner1.x) corner1.x = local.x;
      if (local.y > corner1.y) corner1.y = local.y;
      if (local.z > corner1.z) corner1.z = local.z;
      if (local.x < corner2.x) corner2.x = local.x;
      if (local.y < corner2.y) corner2.y = local.y;
      if (local.z < corner2.z) corner2.z = local.z;
    }
  }

  console.log('count ', count);
  console.log('max ', corner1);
  console.log('min  ', corner2);
  console.log('cost ', Date.now() - time, ' ms');
}

export function getPointsInBox(box: Mesh) {
  const time = Date.now();
  let count = 0;
  const positions = POINTS.value.geometry.getAttribute("position") as BufferAttribute;
  const colors = POINTS.value.geometry.getAttribute("color") as BufferAttribute;
  const corner1 = new Vector3(-Infinity, -Infinity, -Infinity);
  const corner2 = new Vector3(Infinity, Infinity, Infinity);
  const cursor = new Vector3();
  for (let i = 0; i < positions.count; ++i) {
    cursor.fromBufferAttribute(positions, i);
    const local = box.worldToLocal(cursor);
    if (Math.abs(local.x) < 1 / 2
      && Math.abs(local.y) < 1 / 2
      && Math.abs(local.z) < 1 / 2) {
      count++;
      colors.setX(i, 0);
    }
  }
  colors.needsUpdate = true;
  console.log('count ', count);
  console.log('cost ', Date.now() - time, ' ms');
}
