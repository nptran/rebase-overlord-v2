import fs from 'fs';
import path from 'path';

// Genuine 32x32 transparent PNG base64 representation
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALUlEQVRYR2NkGGgD7ODgGPVAKEaNInSgRgwYNUDEgFEDRAwYNUDEgFEDRAwYo8YAnAIB80C9SgAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(pngBase64, 'base64');
const pngSize = pngBuffer.length;

// Create ICO buffer
// 6-byte header
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // Reserved
header.writeUInt16LE(1, 2); // ICO type (1 for icon)
header.writeUInt16LE(1, 4); // Number of images (1)

// 16-byte directory entry for a 32x32 image
const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(32, 0); // Width (32)
dirEntry.writeUInt8(32, 1); // Height (32)
dirEntry.writeUInt8(0, 2); // Color palette (0 for no palette)
dirEntry.writeUInt8(0, 3); // Reserved
dirEntry.writeUInt16LE(1, 4); // Color planes (1)
dirEntry.writeUInt16LE(32, 6); // Bits per pixel (32-bit RGBA)
dirEntry.writeUInt32LE(pngSize, 8); // Size of PNG data payload
dirEntry.writeUInt32LE(22, 12); // Offset to PNG data (6-byte header + 16-byte directory entry = 22)

const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);

const buildDir = path.join(process.cwd(), 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
console.log('Successfully generated build/icon.ico!');
