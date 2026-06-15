/**
 * @title Resize and convert images
 * @difficulty intermediate
 * @tags cli
 * @run -RWE --allow-ffi --allow-sys <url>
 * @resource {https://sharp.pixelplumbing.com/} sharp documentation
 * @group Web frameworks and libraries
 *
 * sharp is the standard high-performance image processing library, and it
 * runs in Deno through npm. Use it to resize uploads, generate thumbnails,
 * and convert between formats such as JPEG, PNG, WebP, and AVIF. Each
 * operation chains onto the previous one and runs when you call an output
 * method.
 */
import sharp from "npm:sharp";

// For a self-contained example, synthesize a source image instead of
// reading one from disk: a solid 400x300 image created from scratch.
const source = await sharp({
  create: {
    width: 400,
    height: 300,
    channels: 3,
    background: { r: 64, g: 120, b: 220 },
  },
}).png().toBuffer();
await Deno.writeFile("source.png", source);

// metadata reads an image's dimensions and format without decoding the
// whole thing, useful for validating uploads before processing them.
const meta = await sharp(source).metadata();
console.log(`${meta.width}x${meta.height} ${meta.format}`); // 400x300 png

// Resize to a target width and let the height scale to keep the aspect
// ratio, then convert to WebP, which is much smaller than PNG for photos.
// The chain ends at toFile, which writes the result.
await sharp(source)
  .resize({ width: 100 })
  .webp({ quality: 80 })
  .toFile("thumbnail.webp");

const thumb = await sharp("thumbnail.webp").metadata();
console.log(`${thumb.width}x${thumb.height} ${thumb.format}`); // 100x75 webp

// resize can also crop to exact dimensions with the cover fit, which fills
// the box and trims the overflow, the behavior you want for square avatars.
await sharp(source)
  .resize({ width: 150, height: 150, fit: "cover" })
  .jpeg()
  .toFile("avatar.jpg");

const avatar = await sharp("avatar.jpg").metadata();
console.log(`${avatar.width}x${avatar.height} ${avatar.format}`); // 150x150 jpeg
