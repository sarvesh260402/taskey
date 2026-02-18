'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Mail, MoreHorizontal, Shield, User, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setEmployees(employees.filter(emp => emp._id !== id));
                setActiveMenu(null);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete employee');
            }
        } catch (err) {
            alert('Error connecting to database');
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (res.ok) {
                setEmployees(data);
            } else {
                setError(data.error || 'Failed to fetch employees');
            }
        } catch (err) {
            setError('Could not connect to the database.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Employees</h1>
                        <p className="text-muted-foreground mt-1">Manage your team members and their roles.</p>
                    </div>
                    <Link href="/employees/add">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 w-fit">
                            <UserPlus size={18} /> Add Member
                        </button>
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-primary" size={40} />
                        <p className="text-muted-foreground font-medium">Loading workforce...</p>
                    </div>
                ) : error ? (
                    <div className="bg-destructive/10 text-destructive p-6 rounded-2xl text-center border border-destructive/20 max-w-md mx-auto">
                        <p className="font-bold">{error}</p>
                        <button onClick={fetchEmployees} className="mt-4 text-sm underline font-semibold">Try again</button>
                    </div>
                ) : employees.length === 0 ? (
                    <Card className="border-dashed border-2 bg-transparent p-12 text-center">
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <User size={30} />
                        </div>
                        <h3 className="text-xl font-bold">No employees yet</h3>
                        <p className="text-muted-foreground mt-2 mb-6 max-w-xs mx-auto text-sm leading-relaxed">
                            It looks like your workforce is empty. Start by adding your first team member.
                        </p>
                        <Link href="/employees/add">
                            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
                                Add First Employee
                            </button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((member) => (
                            <Card key={member._id} className="group overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-xl translate-y-0 hover:-translate-y-1">
                                <CardContent className="p-0">
                                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 h-20 group-hover:from-primary/10 group-hover:to-primary/20 transition-all"></div>
                                    <div className="px-6 pb-6 -mt-10 relative">
                                        <div className="w-20 h-20 rounded-2xl bg-card text-primary border-4 border-card flex items-center justify-center text-2xl font-bold shadow-lg overflow-hidden transition-transform duration-500 group-hover:scale-110">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <div className={cn("w-full h-full bg-primary text-primary-foreground flex items-center justify-center", member.image ? "hidden" : "")}>
                                                {member.avatar}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                                                <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                        <div className="mt-6 flex flex-col gap-2">
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground overflow-hidden">
                                                <Mail size={16} className="shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                <Shield size={16} className="shrink-0" />
                                                <span className="font-medium text-[10px] uppercase tracking-wider">{member.isAdmin ? 'Administrator' : 'Employee Access'}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-6 border-t flex justify-between gap-3 relative">
                                            <Link href={`/employees/${member._id}`} className="flex-1">
                                                <button className="w-full bg-secondary hover:bg-secondary/80 text-foreground py-2 rounded-lg text-sm font-semibold transition-colors">View Profile</button>
                                            </Link>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === member._id ? null : member._id)}
                                                    className="p-2 border rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary h-full"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>

                                                {activeMenu === member._id && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40 bg-transparent"
                                                            onClick={() => setActiveMenu(null)}
                                                        ></div>
                                                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-card border rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200">
                                                            <button
                                                                onClick={() => handleDelete(member._id, member.name)}
                                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors font-semibold"
                                                            >
                                                                <Trash2 size={16} />
                                                                Delete Employee
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
