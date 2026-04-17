"use client";

import { useEffect, useState } from "react";
import { getAllEmployees, updateEmployeeStatus, deleteEmployee } from "@/lib/actions/employeeActions";
import { User, Mail, Phone, Shield, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Employee {
    employeeId: number;
    name: string | null;
    email: string | null;
    phone: string | null;
    status: "PENDING" | "APPROVED" | "DEACTIVATED" | null;
}

export default function AdminEmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        setLoading(true);
        const res = await getAllEmployees();
        if (res.success) {
            setEmployees(res.data as any);
        }
        setLoading(false);
    }

    async function handleStatusChange(id: number, status: string) {
        setActionLoading(id);
        const res = await updateEmployeeStatus(id, status);
        if (res.success) {
            await fetchEmployees();
        }
        setActionLoading(null);
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this employee? This will also delete their system user account.")) return;
        setActionLoading(id);
        const res = await deleteEmployee(id);
        if (res.success) {
            await fetchEmployees();
        } else {
            alert(res.error);
        }
        setActionLoading(null);
    }

    return (
        <div className="container-custom py-12">
            <div className="mb-12">
                <h1 className="text-2xl font-black text-[#0f0f0f] uppercase tracking-tight">Employee Management</h1>
                <p className="text-gray-500 font-medium">Approve registrations and manage system access for your team.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <Loader2 className="h-10 w-10 text-red-600 animate-spin mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing staff records...</p>
                </div>
            ) : employees.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <User className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">No employees found</h3>
                    <p className="text-gray-400 text-sm mt-1">Waiting for system registrations.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {employees.map((emp) => (
                        <div key={emp.employeeId} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                            {/* Status Ribbon */}
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-[0.15em] border-l border-b border-white shadow-sm ${
                                emp.status === "APPROVED" ? "bg-green-500 text-white" :
                                emp.status === "PENDING" ? "bg-amber-500 text-white" :
                                "bg-gray-400 text-white"
                            }`}>
                                {emp.status ?? 'UNKNOWN'}
                            </div>

                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                                    <User className="h-6 w-6 text-gray-400 group-hover:text-red-600 transition-colors" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#0f0f0f] leading-tight mb-1">{emp.name || 'Anonymous Employee'}</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee ID: EMP-{emp.employeeId.toString().padStart(4, '0')}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-gray-500 group/item">
                                    <Mail className="h-4 w-4 text-gray-300 group-hover/item:text-red-500 transition-colors" />
                                    <span className="text-xs font-bold truncate">{emp.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 group/item">
                                    <Phone className="h-4 w-4 text-gray-300 group-hover/item:text-red-500 transition-colors" />
                                    <span className="text-xs font-bold">{emp.phone || 'No phone provided'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                                {emp.status === "PENDING" || emp.status === "DEACTIVATED" ? (
                                    <button 
                                        disabled={actionLoading === emp.employeeId}
                                        onClick={() => handleStatusChange(emp.employeeId!, "APPROVED")}
                                        className="h-10 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === emp.employeeId ? <Loader2 className="h-3 w-3 animate-spin"/> : <CheckCircle className="h-3 w-3"/>}
                                        Approve
                                    </button>
                                ) : (
                                    <button 
                                        disabled={actionLoading === emp.employeeId}
                                        onClick={() => handleStatusChange(emp.employeeId!, "DEACTIVATED")}
                                        className="h-10 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {actionLoading === emp.employeeId ? <Loader2 className="h-3 w-3 animate-spin"/> : <XCircle className="h-3 w-3"/>}
                                        Deactivate
                                    </button>
                                )}
                                <button 
                                    disabled={actionLoading === emp.employeeId}
                                    onClick={() => handleDelete(emp.employeeId!)}
                                    className="h-10 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {actionLoading === emp.employeeId ? <Loader2 className="h-3 w-3 animate-spin"/> : <Trash2 className="h-3 w-3"/>}
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
