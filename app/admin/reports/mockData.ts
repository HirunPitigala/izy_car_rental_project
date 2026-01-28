
export interface Reservation {
    id: string;
    customerName: string;
    licenseNumber: string;
    email: string;
    phoneNumber: string;
    address: string;
    vehicleNumber: string;
    revenue: number;
    date: string;
}

export const mockReservations: Reservation[] = [
    {
        id: "RES-001",
        customerName: "John Doe",
        licenseNumber: "B1234567",
        email: "john@example.com",
        phoneNumber: "+1 234 567 890",
        address: "123 Main St, New York, NY",
        vehicleNumber: "CAM-2024",
        revenue: 150,
        date: "2026-01-28",
    },
    {
        id: "RES-002",
        customerName: "Jane Smith",
        licenseNumber: "B7654321",
        email: "jane@example.com",
        phoneNumber: "+1 987 654 321",
        address: "456 Oak Dr, Los Angeles, CA",
        vehicleNumber: "TES-555",
        revenue: 200,
        date: "2026-01-28",
    },
    {
        id: "RES-003",
        customerName: "Alice Johnson",
        licenseNumber: "C1122334",
        email: "alice@example.com",
        phoneNumber: "+1 555 123 456",
        address: "789 Pine Ln, Chicago, IL",
        vehicleNumber: "FOR-123",
        revenue: 120,
        date: "2026-01-27",
    },
    {
        id: "RES-004",
        customerName: "Bob Brown",
        licenseNumber: "D4455667",
        email: "bob@example.com",
        phoneNumber: "+1 444 789 012",
        address: "321 Cedar Blvd, Miami, FL",
        vehicleNumber: "CHE-999",
        revenue: 180,
        date: "2026-01-26",
    },
];

export const dailySummary = {
    date: "Wednesday - 2026/01/28",
    totalRevenue: 350,
};

export const weeklySummary = {
    range: "2026/01/22 - 2026/01/28",
    totalRevenue: 2450,
    dailyBreakdown: [
        { day: "Monday", date: "2026-01-26", revenue: 300 },
        { day: "Tuesday", date: "2026-01-27", revenue: 450 },
        { day: "Wednesday", date: "2026-01-28", revenue: 350 },
        { day: "Thursday", date: "2026-01-22", revenue: 280 },
        { day: "Friday", date: "2026-01-23", revenue: 520 },
        { day: "Saturday", date: "2026-01-24", revenue: 400 },
        { day: "Sunday", date: "2026-01-25", revenue: 150 },
    ],
};

export const monthlySummary = {
    month: "January 2026",
    totalRevenue: 10500,
    weeklyBreakdown: [
        { week: "Week 1", range: "Jan 1 - Jan 7", revenue: 2100 },
        { week: "Week 2", range: "Jan 8 - Jan 14", revenue: 2800 },
        { week: "Week 3", range: "Jan 15 - Jan 21", revenue: 2500 },
        { week: "Week 4", range: "Jan 22 - Jan 28", revenue: 2450 },
    ],
};
