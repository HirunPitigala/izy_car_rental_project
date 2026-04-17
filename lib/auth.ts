
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export type Role = "admin" | "manager" | "customer" | "employee";

export interface UserSession {
    userId: number;
    relatedId?: number; // The ID in the role-specific table (admin_id, customer_id, etc)
    role: Role;
    expiresAt: Date;
    user?: {
        name: string | null;
        email: string | null;
    };
}

import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "auth_debug.log");
export function logDebug(message: string) {
    try {
        const timestamp = new Date().toISOString();
        const LOG_FILE = path.join(process.cwd(), "auth_debug.log");
        fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
    } catch (e: any) {
        // Ignore logging errors
    }
}

// This variable will hold the encoded key once it's first retrieved
let _cachedKey: Uint8Array | undefined;

function getSecretKey(): Uint8Array {
    if (_cachedKey) {
        return _cachedKey;
    }

    const envSecret = process.env.JWT_SECRET;
    if (!envSecret) {
        logDebug("CRITICAL: JWT_SECRET is not defined in environment variables");
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    logDebug("getSecretKey: Retrieved secret from process.env");
    _cachedKey = new TextEncoder().encode(envSecret);
    return _cachedKey;
}

export async function encrypt(payload: any) {
    const key = getSecretKey();
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const key = getSecretKey();
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (err) {
        console.error("decrypt: Verification failed", err);
        return null;
    }
}

import { cache } from "react";

// Cache the session per request to avoid multiple DB lookups
export const getSession = cache(async (): Promise<UserSession | null> => {
    try {
        logDebug(`getSession: Starting (NODE_ENV: ${process.env.NODE_ENV})...`);
        const cookieStore = await cookies();
        const cookie = cookieStore.get("session");
        const sessionToken = cookie?.value;

        if (!sessionToken) {
            logDebug("getSession: No 'session' cookie found");
            return null;
        }

        logDebug(`getSession: Found session token (length: ${sessionToken.length}), decrypting...`);
        const decoded = await decrypt(sessionToken);
        if (!decoded) {
            logDebug("getSession: Decryption returned null");
            return null;
        }

        const role = String(decoded.role).toLowerCase() as Role;
        const userId = Number(decoded.userId);
        const relatedId = decoded.relatedId ? Number(decoded.relatedId) : undefined;

        logDebug(`getSession: Decoded session for role: ${role}, userId: ${userId}`);

        // Read name/email from the JWT payload — embedded at login time.
        // This avoids a DB round-trip on every request (critical for SSE connections).
        const userData: { name: string | null; email: string | null } = {
            name: decoded.name ?? null,
            email: decoded.email ?? null,
        };

        logDebug("getSession: Success. Returning session.");
        return {
            userId: userId,
            relatedId: relatedId,
            role: role,
            expiresAt: new Date((decoded.exp || 0) * 1000),
            user: userData
        };
    } catch (error: any) {
        logDebug(`getSession: Unexpected error: ${error?.message}`);
        console.error("getSession: Unexpected error", error);
        return null;
    }
});
