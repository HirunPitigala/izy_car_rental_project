/**
 * Client-side utility for uploading files directly to Cloudinary.
 */

export async function uploadFileToCloudinary(
    file: File,
    folder: string = 'car-rental'
): Promise<string> {
    try {
        // 1. Get signed configuration from our own API
        // We use 'image' for PDFs as Cloudinary handles them better as viewable docs this way
        const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const resourceType = 'image'; // Set to image for both images and pdfs as per our backend strategy

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

        const { signature, timestamp, apiKey, cloudName, debugStringToSign } = await signResponse.json();
        console.log("ANTIGRAVITY DEBUG - Server String to Sign:", debugStringToSign);

        // 2. Prepare Form Data for Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('folder', folder);

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
