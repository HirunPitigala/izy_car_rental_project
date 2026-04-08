import { redirect } from "next/navigation";

export default function EmployeePage() {
    redirect("/employee/bookings/requested");
}
