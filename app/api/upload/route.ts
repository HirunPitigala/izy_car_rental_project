import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // SECURITY FIX (A01): Unrestricted File Upload
        // Validate file type (permit only images and PDFs)
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `File type "${file.type}" is not allowed. Only images and PDFs are permitted.` },
                { status: 400 }
            );
        }

        // Validate file extension
        const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif", "pdf"];
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!extension || !allowedExtensions.includes(extension)) {
             return NextResponse.json(
                { error: `File extension ".${extension}" is not allowed.` },
                { status: 400 }
            );
        }

        // Validate file size (e.g., 10MB limit)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File size exceeds the 10MB limit." },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniqueSuffix}.${extension}`;

        const uploadDir = join(process.cwd(), "public", "uploads");

        // Ensure directory exists (though we ran mkdir command, this is safer)
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
