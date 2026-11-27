// Image uploads -> Amazon S3 (or any S3-compatible storage: Wasabi, DigitalOcean Spaces, Cloudflare R2, MinIO ...).
//
// .env
//   S3_BUCKET=mpupdate-media            (required)
//   S3_REGION=ap-south-1                (default ap-south-1)
//   S3_ACCESS_KEY_ID=...                (optional – falls back to the AWS default chain / IAM role)
//   S3_SECRET_ACCESS_KEY=...
//   S3_FOLDER=mpupdate                  (key prefix, default "mpupdate")
//   S3_PUBLIC_URL=https://cdn.mpupdate.com   (optional – CloudFront / custom domain used to build image links)
//   S3_ENDPOINT=https://...             (only for non-AWS providers; also set S3_FORCE_PATH_STYLE=true for MinIO)
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

let sharp = null;
try {
  sharp = require("sharp"); // optional: resizes + compresses photos before upload
} catch (e) {
  sharp = null;
}

const MAX_BYTES = 12 * 1024 * 1024;
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

let client = null;
const getClient = () => {
  if (client) return client;
  const opts = { region: process.env.S3_REGION || "ap-south-1" };
  if (process.env.S3_ENDPOINT) {
    opts.endpoint = process.env.S3_ENDPOINT;
    opts.forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE || "").toLowerCase() === "true";
  }
  if (process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
    opts.credentials = { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY };
  }
  client = new S3Client(opts);
  return client;
};

const publicUrl = (key) => {
  const bucket = process.env.S3_BUCKET;
  if (process.env.S3_PUBLIC_URL) return `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  if (process.env.S3_ENDPOINT) return `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${bucket}/${key}`;
  return `https://${bucket}.s3.${process.env.S3_REGION || "ap-south-1"}.amazonaws.com/${key}`;
};

/**
 * Uploads one express-fileupload file (useTempFiles) to S3.
 * Returns { secure_url, url, public_id } – same shape the rest of the API already uses.
 */
exports.uploadImage = async (file, folder) => {
  if (!process.env.S3_BUCKET) throw new Error("S3 is not configured (set S3_BUCKET in .env)");
  if (!file || !file.mimetype || !EXT[file.mimetype]) throw new Error("Only JPG, PNG, WEBP, GIF or AVIF images are allowed");
  if (file.size > MAX_BYTES) throw new Error("Image is too large (max 12 MB)");

  try {
    let body = await fs.promises.readFile(file.tempFilePath);
    let contentType = file.mimetype;
    let ext = EXT[file.mimetype];

    if (sharp && file.mimetype !== "image/gif") {
      body = await sharp(body).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
      contentType = "image/webp";
      ext = "webp";
    }

    const now = new Date();
    const prefix = (folder || process.env.S3_FOLDER || "mpupdate").replace(/^\/|\/$/g, "");
    const key = `${prefix}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomBytes(12).toString("hex")}.${ext}`;

    await getClient().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const url = publicUrl(key);
    return { secure_url: url, url, public_id: key };
  } finally {
    fs.promises.unlink(file.tempFilePath).catch(() => {});
  }
};

exports.s3Configured = () => Boolean(process.env.S3_BUCKET);
