
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customer } from '@/src/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fullName, email, phone, password, nic, licenseNumber, address, username } = body;

        // Basic Backend Validation
        if (!fullName || !email || !phone || !password || !nic || !licenseNumber || !address || !username) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ message: 'Password must be at least 8 characters long.' }, { status: 400 });
        }

        // Email format validation (basic regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
        }

        // Check for duplicates (email, nic, username)
        const existingCustomer = await db.select().from(customer).where(
            or(
                eq(customer.email, email),
                eq(customer.nic, nic),
                eq(customer.username, username)
            )
        );

        if (existingCustomer.length > 0) {
            let duplicateField = 'Email, NIC, or Username';
            if (existingCustomer[0].email === email) duplicateField = 'Email';
            if (existingCustomer[0].nic === nic) duplicateField = 'NIC';
            if (existingCustomer[0].username === username) duplicateField = 'Username';

            return NextResponse.json({ message: `${duplicateField} already exists.` }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        await db.insert(customer).values({
            fullName,
            email,
            phone,
            password: hashedPassword,
            nic,
            licenseNumber,
            address,
            username,
            registrationDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            termsAccepted: 1, // true
        });

        return NextResponse.json({ message: 'Customer registered successfully.' }, { status: 201 });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ message: 'Internal Server Error.' }, { status: 500 });
    }
}
