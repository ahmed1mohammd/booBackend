import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'boo-automotive',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer to Cloudinary with automatic resilient fallback
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = (buffer, folder = 'boo-automotive') => {
  return new Promise((resolve) => {
    // Generate fallback base64 Data URL if Cloudinary is misconfigured or fails
    const createFallback = () => {
      const base64Data = buffer.toString('base64');
      const mockUrl = `data:image/jpeg;base64,${base64Data}`;
      const mockPublicId = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      return {
        url: mockUrl,
        publicId: mockPublicId
      };
    };

    // Check if Cloudinary credentials are provided and cloud_name is not the default placeholder
    const isConfigured =
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key_here' &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'boo-automotive';

    if (!isConfigured) {
      return resolve(createFallback());
    }

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }]
        },
        (error, result) => {
          if (error) {
            console.warn(`[Cloudinary Notice] Upload to cloud failed (${error.message}). Using resilient asset fallback.`);
            return resolve(createFallback());
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      uploadStream.end(buffer);
    } catch (err) {
      console.warn(`[Cloudinary Stream Error]: ${err.message}. Using resilient asset fallback.`);
      resolve(createFallback());
    }
  });
};

/**
 * Delete image asset from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('asset_') || publicId.startsWith('mock_') || publicId.startsWith('hero_') || publicId.startsWith('about_')) return;
  try {
    if (
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key_here' &&
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'boo-automotive'
    ) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.warn(`[Cloudinary Delete Error] Failed to delete asset: ${publicId} (${error.message})`);
  }
};

export default cloudinary;
