import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAssignmentDetails } from "@/lib/actions/assignmentActions";
import { getOrSeedChecklistItems, getInspection } from "@/lib/actions/inspectionActions";
import InspectionWorkspace from "@/components/employee/InspectionWorkspace";

export default async function EmployeeAssignedDetailPage({
    params
}: {
    params: Promise<{ category: string; id: string }>
}) {
    // Authenticate employee
    const session = await getSession();
    if (!session || session.role !== "employee" || !session.relatedId) {
        redirect("/auth/login");
    }

    const { category, id } = await params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
        redirect("/employee/assigned");
    }

    // Fetch unified assignment details using the helper we created
    const assignmentResult = await getAssignmentDetails(category, numericId, session.relatedId);

    if (!assignmentResult.success || !assignmentResult.data) {
        // If data isn't found or unauthorized for this employee, redirect back
        redirect(`/employee/assigned?category=${category}`);
    }

    // Cache the standard checklist items for the child form
    const items = await getOrSeedChecklistItems();

    // Fetch existing inspection data for rent-a-car only (inspection.bookingId FK → booking table)
    let preRentalData = null;
    let afterRentalData = null;

    if (category === "rent-a-car" || category === "airport" || category === "wedding") {
        const [preResult, afterResult] = await Promise.all([
            getInspection(numericId, "BEFORE"),
            getInspection(numericId, "AFTER")
        ]);
        preRentalData = preResult.success ? preResult.data : null;
        afterRentalData = afterResult.success ? afterResult.data : null;
    }

    return (
        <InspectionWorkspace
            category={category}
            id={numericId}
            data={assignmentResult.data as any}
            employeeId={session.relatedId}
            items={items}
            preRentalData={preRentalData}
            afterRentalData={afterRentalData}
        />
    );
}
