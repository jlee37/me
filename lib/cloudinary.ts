import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Resize to max 2400px wide and compress to stay well under Cloudinary's 10MB limit.
// High-res photos are typically 20-30MB; this brings them to ~2-4MB with negligible quality loss at display sizes.
async function compressForUpload(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 88, progressive: true })
    .toBuffer();
}

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; width: number; height: number }> {
  const compressed = await compressForUpload(buffer);

  const result = await new Promise<{
    secure_url: string;
    width: number;
    height: number;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "photojournal",
          public_id: filename.replace(/\.[^/.]+$/, ""),
          resource_type: "image",
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("No result"));
          else resolve(result as typeof result & { secure_url: string });
        }
      )
      .end(compressed);
  });

  return {
    url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

export default cloudinary;
