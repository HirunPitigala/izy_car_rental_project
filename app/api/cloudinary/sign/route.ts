import { NextResponse } from 'next/server';
import { generateCloudinarySignature } from '@/lib/cloudinary';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { folder } = body;

        // Only sign the parameters that Cloudinary expects for this request type
        // 'resource_type' is part of the URL path, NOT the signature parameters
        const signatureData = generateCloudinarySignature({
            folder: folder || 'car-rental',
        });

        return NextResponse.json(signatureData);
    } catch (error) {
        console.error('Cloudinary Sign Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
