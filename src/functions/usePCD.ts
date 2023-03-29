import {PCDData, PCDHeader} from "@/types/pcd";
import {item, pcdDataCache} from "@/store/item";


const PCDDatabaseName = 'PCDDatabase';
const PCDTableName = 'pcd';

function loadPCDFromRemote(url: string) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      const result = parse(data);
      result.url = url;
      return result;
    })
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
    header,
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
  // 去掉注释
  header.str = data.slice(0, header.headerLen).replace(/#.*/gi, "");
  header.data = dataLine[1];
  // 解析
  let tmp;
  if (tmp = /VERSION (.*)/i.exec(header.str)) header.version = parseFloat(tmp[1]);
  if (tmp = /FIELDS (.*)/i.exec(header.str)) header.fields = tmp[1].split(' ');
  if (tmp = /TYPE (.*)/i.exec(header.str)) header.type = tmp[1].split(' ');
  if (tmp = /WIDTH (.*)/i.exec(header.str)) header.width = parseInt(tmp[1]);
  if (tmp = /HEIGHT (.*)/i.exec(header.str)) header.height = parseInt(tmp[1]);
  if (tmp = /POINTS (.*)/i.exec(header.str))
    header.points = tmp === null ? header.width * header.height : parseInt(tmp[1], 10);

  if (tmp = /VIEWPOINT (.*)/i.exec(header.str)) header.viewpoint = tmp[1];
  if (tmp = /SIZE (.*)/i.exec(header.str)) header.size = tmp[1].split(' ').map(x => parseInt(x, 10));
  if (tmp = /COUNT (.*)/i.exec(header.str))
    header.count = tmp === null ? header.fields.map(x => 1) : tmp[1].split(' ').map(x => parseInt(x, 10));

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

export function loadPCD() {
  window.indexedDB.open(PCDDatabaseName).onupgradeneeded = function (e) {
    const target = e.target as IDBOpenDBRequest;
    const db = target.result;
    db.createObjectStore(PCDTableName, {keyPath: 'url'});
  }

  window.indexedDB.open(PCDDatabaseName).onsuccess = function (e) {
    const target = e.target as IDBOpenDBRequest;
    const db = target.result;
    const transaction = db.transaction(PCDTableName, 'readonly');
    for (let index in item.urls) {
      const url = item.urls[index];
      const request = transaction.objectStore(PCDTableName).get(url);
      request.onsuccess = function (e) {
        if (request.result) {
          pcdDataCache[index] = request.result;
        } else {
          // otherwise load from remote
          loadPCDFromRemote(url).then(data => {
            pcdDataCache[index] = data;
            const transaction = db.transaction(PCDTableName, 'readwrite');
            transaction.objectStore(PCDTableName).add(data);
          }).catch(e => {
            console.error(e);
          })
        }
      }
    }
  }
}
