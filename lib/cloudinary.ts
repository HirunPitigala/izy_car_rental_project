import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Uploads a file buffer to Cloudinary (Server-side helper).
 */
export async function uploadToCloudinary(
    file: Buffer,
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
        uploadStream.end(file);
    });
}

/**
 * Uploads a Base64 string directly to Cloudinary.
 * Useful for images from frontend croppers/previews.
 */
export async function uploadBase64ToCloudinary(
    base64String: string,
    folder: string = 'car-rental'
): Promise<{ secure_url: string; public_id: string }> {
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder,
            resource_type: 'auto',
        });
        return {
            secure_url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("Cloudinary Base64 Upload Error:", error);
        throw error;
    }
}

/**
 * Generates a signature for a signed upload from the client.
 */
export function generateCloudinarySignature(params: Record<string, any>) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const secret = process.env.CLOUDINARY_API_SECRET?.trim();
    
    if (!secret) {
        throw new Error("CLOUDINARY_API_SECRET is missing from environment variables.");
    }

    // Sort parameters and sign
    const signature = cloudinary.utils.api_sign_request(
        { ...params, timestamp },
        secret
    );

    const stringToSign = Object.keys({ ...params, timestamp }).sort()
        .map(key => `${key}=${({ ...params, timestamp } as any)[key]}`)
        .join('&');

    console.log(`[Cloudinary Signature Debug] Signing: "${stringToSign}" with secret starting with: ${secret.substring(0, 4)}...`);
    
    return {
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        debugStringToSign: stringToSign
    };
}
