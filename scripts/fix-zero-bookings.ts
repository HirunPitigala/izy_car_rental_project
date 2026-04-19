import { db } from "../src/db";
import { booking, vehicle } from "../src/db/schema";
import { calculateRentalPrice } from "../lib/price-helper";
import { eq } from "drizzle-orm";

async function main() {
    const bookings = await db.select({
        bookingId: booking.bookingId,
        rentalDate: booking.rentalDate,
        returnDate: booking.returnDate,
        totalFare: booking.totalFare,
        vehicleId: booking.vehicleId
    }).from(booking);
    
    for (const b of bookings) {
        if (!b.totalFare || parseFloat(b.totalFare) === 0) {
            if (!b.vehicleId || !b.rentalDate || !b.returnDate) continue;
            
            const [v] = await db.select({
                rentPerDay: vehicle.rentPerDay,
                rentPerHour: vehicle.rentPerHour
            }).from(vehicle).where(eq(vehicle.vehicleId, b.vehicleId));
            
            if (v) {
                const start = new Date(b.rentalDate);
                const end = new Date(b.returnDate);
                
                const startDate = start.toISOString().split("T")[0];
                const startTime = start.toISOString().split("T")[1].substring(0, 5);
                
                const endDate = end.toISOString().split("T")[0];
                const endTime = end.toISOString().split("T")[1].substring(0, 5);
                
                const pricing = calculateRentalPrice(
                    startDate,
                    startTime,
                    endDate,
                    endTime,
                    v.rentPerDay ?? 0,
                    v.rentPerHour ?? 0
                );
                
                const newTotal = pricing.totalPrice.toFixed(2);
                console.log(`Updating booking ${b.bookingId} from ${b.totalFare} to ${newTotal}`);
                await db.update(booking).set({ totalFare: newTotal }).where(eq(booking.bookingId, b.bookingId));
            }
        }
    }
    
    console.log("Finished updating database.");
}

main().catch(console.error);
