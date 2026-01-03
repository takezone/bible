// アイコン生成スクリプト
// 使用方法: node scripts/generate-icons.js
// 注意: このスクリプトはsharpまたはcanvasモジュールが必要です

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// シンプルなPNGヘッダーを生成（単色の正方形）
function createSimplePNG(size) {
  // PNG署名
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDRチャンク
  const width = size;
  const height = size;
  const bitDepth = 8;
  const colorType = 2; // RGB
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(bitDepth, 8);
  ihdrData.writeUInt8(colorType, 9);
  ihdrData.writeUInt8(0, 10); // compression
  ihdrData.writeUInt8(0, 11); // filter
  ihdrData.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDATチャンク（単色の青色の画像データ）
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      // 青色のグラデーション（#1e40af）
      rawData.push(30);  // R
      rawData.push(64);  // G
      rawData.push(175); // B
    }
  }

  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idatChunk = createChunk('IDAT', compressed);

  // IENDチャンク
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);

  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

// CRC32計算
function crc32(buf) {
  let crc = 0xffffffff;
  const table = makeCRCTable();
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeCRCTable() {
  const table = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}

// アイコンを生成
console.log('Generating PWA icons...');
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  const png = createSimplePNG(size);
  fs.writeFileSync(filepath, png);
  console.log(`Created: ${filename}`);
});

console.log('Done! Icons generated in public/icons/');
console.log('Note: These are placeholder icons. Replace with proper designed icons for production.');
