import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Uploads a file to Cloudinary.
 * @param file - The file to upload. Can be a base64 string or a file path (for server-side temp files).
 *               For client-side uploads sent as FormData, we might need to buffer it first.
 * @param folder - The folder in Cloudinary to upload to.
 * @param resourceType - The resource type ("image", "raw", "auto"). Use "raw" or "auto" for PDFs.
 */
export async function uploadToCloudinary(
    file: string | Buffer,
    folder: string = 'car-rental',
    resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                    return;
                }
                if (!result) {
                    reject(new Error("Cloudinary upload failed: No result returned"));
                    return;
                }
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        if (Buffer.isBuffer(file)) {
            uploadStream.end(file);
        } else {
            // If it's a string (base64 or path), we can't easily stream it into upload_stream directly 
            // without knowing if it's a path or base64. 
            // For Base64 that might come from vehicle form, we can actually use cloudinary.uploader.upload directly.
            // But to keep it unified, let's handle specific cases or just use the direct upload for strings.

            // However, the prompt implies we might receive files from FormData (Buffers) or Base64 strings.
            // Let's split logic:
            reject(new Error("String input not supported in this stream helper. Use uploadToCloudinaryString for base64/paths."));
        }
    });
}

export async function uploadBase64ToCloudinary(
    base64String: string,
    folder: string = 'car-rental',
    resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'
): Promise<{ secure_url: string; public_id: string }> {
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder,
            resource_type: resourceType
        });
        return {
            secure_url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error("Cloudinary Base64 Upload Error:", error);
        throw error;
    }
}
