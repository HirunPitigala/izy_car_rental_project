
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { v4 as uuidv4 } from "uuid";

async function testInsert() {
    const { db } = await import("./lib/db");
    const { booking } = await import("./src/db/schema");
    console.log("Testing Booking Insert...");
    try {
        await (db.insert(booking) as any).values({
            userId: 28, // Matches screenshot
            vehicleId: 10,
            serviceCategoryId: 1,
            rentalDate: new Date("2026-02-10T05:51:00.000Z"),
            returnDate: new Date("2026-02-11T05:51:00.000Z"),
            customerFullName: "NEW CUSTOMER",
            customerPhoneNumber1: "0125120360",
            customerPhoneNumber2: "4154",
            customerLicenseNo: "000222115125",
            // Intentionally missing or null customerNicNo to test? 
            // The screenshot param list seemed to skip it.
            // Let's try passing a valid string first, if that works, then we know the issue is missing data.
            // If that fails, we know it's something else.
            customerNicNo: "123456789V",
            customerDrivingLicencePdf: "/uploads/documents/license-test.pdf",
            customerIdPdf: "/uploads/documents/id-test.pdf",
            guaranteeFullname: "AELRIUGHQ",
            guaranteeAddress: "EVRBET",
            guaranteePhoneNo1: "0125458952",
            guaranteePhoneNo2: "012457878956",
            // guaranteeNicNo also seemed presumably present or missing?
            guaranteeNicNo: "987654321V",
            guaranteeNicPdf: "/uploads/documents/gnic-test.pdf",
            guaranteeLicensePdf: "/uploads/documents/glicense-test.pdf",
            totalFare: "5000.00",
            bookingStatus: "PENDING",
            terms1: true,
            terms2Confirmation: true,
            pickupLocation: "Test Loc",
            dropoffLocation: "Test Loc"
        });
        console.log("Insert SUCCESS!");
    } catch (error: any) {
        console.error("Insert FAILED:");
        console.error(error);
        if (error.sqlMessage) console.error("SQL Message:", error.sqlMessage);
    }
    process.exit(0);
}

testInsert();
