import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
    title: string;
    range: string;
    totalRevenue: number;
    totalBookings: number;
    reservations: any[];
}

export const generateReportPDF = (data: ReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("IZY Car Rental", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(data.title, pageWidth / 2, 30, { align: "center" });

    doc.line(20, 35, pageWidth - 20, 35); // Divider line

    // 2. Report Information
    doc.setFontSize(10);
    doc.text(`Report Period: ${data.range}`, 20, 45);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 20, 50);

    // 3. Summary Section
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 60, pageWidth - 40, 25, "F");
    
    doc.setFont("helvetica", "bold");
    doc.text("Summary Information", 25, 68);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Total Bookings: ${data.totalBookings}`, 25, 75);
    doc.text(`Total Revenue: LKR ${data.totalRevenue.toLocaleString()}`, 25, 80);
    doc.text(`Avg Revenue: LKR ${(data.totalRevenue / (data.totalBookings || 1)).toLocaleString()}`, 100, 75);

    // 4. Data Table
    const tableHeaders = [["ID", "Customer", "Vehicle", "Date", "Status", "Revenue"]];
    const tableBody = data.reservations.map(res => [
        res.id?.toString() || "N/A",
        res.customerName || "N/A",
        res.vehicleNumber || "N/A",
        res.date ? new Date(res.date).toLocaleDateString() : "N/A",
        res.status || "N/A",
        `LKR ${parseFloat(res.revenue || "0").toLocaleString()}`
    ]);

    autoTable(doc, {
        startY: 95,
        head: tableHeaders,
        body: tableBody,
        theme: "striped",
        headStyles: { fillColor: [15, 15, 15], textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 20, right: 20 }
    });

    // 5. Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("This is an automated system-generated report.", 20, finalY);
    doc.text("Internal Use Only - Confidential", pageWidth - 20, finalY, { align: "right" });

    // Return Blob
    return doc.output('blob');
};
