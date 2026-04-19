/**
 * Client-side utility for uploading files directly to Cloudinary.
 */

export async function uploadFileToCloudinary(
    file: File,
    folder: string = 'car-rental'
): Promise<string> {
    try {
        // 1. Get signed configuration from our own API
        // Use 'auto' to let Cloudinary detect the file type (PDF, image, etc.)
        const resourceType = 'auto'; 

        const signResponse = await fetch('/api/cloudinary/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                folder,
                resource_type: resourceType 
            }),
        });

        if (!signResponse.ok) {
            throw new Error('Failed to get Cloudinary signature');
        }

        const { signature, timestamp, apiKey, cloudName, folder: signedFolder } = await signResponse.json();

        // 2. Prepare Form Data for Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('folder', signedFolder);

        // 3. Upload to Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        
        const uploadResponse = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error('Cloudinary Upload Error:', errorData);
            throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
        }

        const uploadResult = await uploadResponse.json();
        return uploadResult.secure_url;
    } catch (error) {
        console.error('Error in uploadFileToCloudinary:', error);
        throw error;
    }
}
