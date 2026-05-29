import fs from 'fs';
import path from 'path';

// 1x1 transparent PNG base64
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const pngBuffer = Buffer.from(pngBase64, 'base64');
const pngSize = pngBuffer.length;

// Create ICO buffer
// 6-byte header
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // ICO typ
header.writeUInt16LE(1, 4); // Number of images

// 16-byte directory entry
const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(32, 0); // Width (let's say 32, most compatible)
dirEntry.writeUInt8(32, 1); // Height (32)
dirEntry.writeUInt8(0, 2); // Color palette
dirEntry.writeUInt8(0, 3); // Reserved
dirEntry.writeUInt16LE(1, 4); // Color planes
dirEntry.writeUInt16LE(32, 6); // Bits per pixel
dirEntry.writeUInt32LE(pngSize, 8); // Size of PNG data
dirEntry.writeUInt32LE(22, 12); // Offset to PNG data (6 + 16 = 22)

const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);

const buildDir = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
console.log('Successfully generated build/icon.ico!');
