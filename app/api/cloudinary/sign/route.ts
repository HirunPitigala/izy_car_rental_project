import { NextResponse } from 'next/server';
import { generateCloudinarySignature } from '@/lib/cloudinary';
import { getSession } from '@/lib/auth';

// ─────────────────────────────────────────────────────────────
// SECURITY: Role-based folder whitelist.
// Each role may ONLY sign uploads to their permitted folders.
// Any other folder value is rejected with a 403.
// ─────────────────────────────────────────────────────────────
const ALLOWED_FOLDERS: Record<string, string[]> = {
    admin: [
        'vehicles',
        'bookings/license',
        'bookings/id',
        'bookings/guarantor-nic',
        'bookings/guarantor-license',
        'bookings/paymentslip',
        'pay-slips/pickup',
        'pay-slips/airport',
        'car-rental',
    ],
    manager: [], // managers do not upload files
    employee: [
        'bookings/license',
        'bookings/id',
    ],
    customer: [
        'bookings/license',
        'bookings/id',
        'bookings/guarantor-nic',
        'bookings/guarantor-license',
        'bookings/paymentslip',
        'pay-slips/pickup',
        'pay-slips/airport',
    ],
};

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        // Normalize: trim slashes and lowercase to prevent bypass via casing or trailing slashes
        const requestedFolder = (body.folder || 'car-rental').trim().replace(/^\/|\/$/g, '').toLowerCase();

        // Look up the permitted folders for this role
        const permitted = ALLOWED_FOLDERS[session.role] ?? [];
        if (!permitted.includes(requestedFolder)) {
            console.warn(
                `[Cloudinary/Sign] BLOCKED: role="${session.role}" userId=${session.userId} ` +
                `attempted to sign folder="${requestedFolder}"`
            );
            return NextResponse.json(
                { error: `Forbidden: your role is not permitted to upload to "${requestedFolder}"` },
                { status: 403 }
            );
        }

        const signatureData = generateCloudinarySignature({
            folder: requestedFolder,
        });

        return NextResponse.json(signatureData);
    } catch (error) {
        console.error('Cloudinary Sign Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
