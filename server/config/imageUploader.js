// Image uploads -> Amazon S3 (or any S3-compatible storage: Wasabi, DigitalOcean Spaces, Cloudflare R2, MinIO ...).
//
// .env  (the AWS_* names are the primary ones; the S3_* names also work)
//   AWS_S3_BUCKET=inext-media-storage          (required)
//   AWS_REGION=ap-south-1
//   AWS_ACCESS_KEY_ID=...  AWS_SECRET_ACCESS_KEY=...   (optional on EC2 with an IAM role)
//   AWS_S3_BASE_FOLDER=mpupdate.com            (key prefix for everything this site uploads)
//   S3_PUBLIC_URL=https://cdn.mpupdate.com     (optional – CloudFront / custom domain for image links)
//   S3_ENDPOINT=https://...                    (only for non-AWS providers; S3_FORCE_PATH_STYLE=true for MinIO)
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
const env = {
  bucket: () => process.env.AWS_S3_BUCKET || process.env.S3_BUCKET,
  region: () => process.env.AWS_REGION || process.env.S3_REGION || "ap-south-1",
  keyId: () => process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID,
  secret: () => process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY,
  base: () => process.env.AWS_S3_BASE_FOLDER || process.env.S3_FOLDER || "mpupdate",
};

const getClient = () => {
  if (client) return client;
  const opts = { region: env.region() };
  if (process.env.S3_ENDPOINT) {
    opts.endpoint = process.env.S3_ENDPOINT;
    opts.forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE || "").toLowerCase() === "true";
  }
  if (env.keyId() && env.secret()) {
    opts.credentials = { accessKeyId: env.keyId(), secretAccessKey: env.secret() };
  }
  client = new S3Client(opts);
  return client;
};

const publicUrl = (key) => {
  const bucket = env.bucket();
  if (process.env.S3_PUBLIC_URL) return `${process.env.S3_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  if (process.env.S3_ENDPOINT) return `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${bucket}/${key}`;
  return `https://${bucket}.s3.${env.region()}.amazonaws.com/${key}`;
};

/**
 * Uploads one express-fileupload file (useTempFiles) to S3.
 * Returns { secure_url, url, public_id } – same shape the rest of the API already uses.
 */
exports.uploadImage = async (file, folder) => {
  if (!env.bucket()) throw new Error("S3 is not configured (set AWS_S3_BUCKET in .env)");
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
    const prefix = [env.base(), folder].filter(Boolean).join("/").replace(/\/+/g, "/").replace(/^\/|\/$/g, "");
    const key = `${prefix}/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomBytes(12).toString("hex")}.${ext}`;

    await getClient().send(
      new PutObjectCommand({
        Bucket: env.bucket(),
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

exports.s3Configured = () => Boolean(env.bucket());
