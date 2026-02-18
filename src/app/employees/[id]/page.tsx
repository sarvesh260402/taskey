'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    User,
    Mail,
    Shield,
    Briefcase,
    ArrowLeft,
    MapPin,
    Calendar,
    Phone,
    Clock,
    CheckCircle2,
    FileText,
    Loader2,
    X,
    Settings,
    Eye,
    EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function EmployeeProfilePage() {
    const params = useParams();
    const id = params.id as string;
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEmployee();
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const res = await fetch(`/api/employees/${id}`);
            const data = await res.json();
            console.log('Fetched Employee Data:', data);
            if (res.ok) {
                setEmployee(data);
                setFormData(data);
            } else {
                setError(data.error || 'Profile not found');
            }
        } catch (err) {
            setError('Error connecting to database');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setEmployee(data);
                setIsEditing(false);
                // Optionally show success toast if available
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (err) {
            alert('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-muted-foreground font-medium text-lg">Retrieving profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !employee) {
        return (
            <DashboardLayout>
                <div className="max-w-md mx-auto mt-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto border-4 border-destructive/20 animate-pulse">
                        <User size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">Profile Unavailable</h2>
                        <p className="text-muted-foreground">{error || "We couldn't find the employee profile you're looking for."}</p>
                    </div>
                    <Link href="/employees">
                        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 mx-auto mt-8">
                            <ArrowLeft size={18} /> Back to Directory
                        </button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    // Mock stats - in a real app these would come from DB too
    const stats = [
        { label: 'Tasks Completed', value: '145', icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Active Projects', value: '12', icon: Briefcase, color: 'text-blue-500' },
        { label: 'Days Active', value: '342', icon: Clock, color: 'text-purple-500' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <div className="flex items-center gap-4">
                    <Link href="/employees" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Employee Profile</h1>
                        <p className="text-muted-foreground mt-1">Detailed information and performance metrics.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="overflow-hidden border-2 border-primary/5 shadow-xl">
                            <CardContent className="p-0">
                                <div className="h-32 bg-gradient-to-br from-primary to-blue-600"></div>
                                <div className="px-6 pb-8 -mt-16 text-center">
                                    <div className="w-32 h-32 rounded-3xl bg-card text-primary mx-auto border-[6px] border-card flex items-center justify-center text-4xl font-bold shadow-2xl overflow-hidden mb-4 relative group">
                                        {employee.image ? (
                                            <img
                                                src={employee.image}
                                                alt={employee.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={cn("w-full h-full bg-primary/10 flex items-center justify-center", employee.image ? "hidden" : "")}>
                                            {employee.avatar}
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold">{employee.name}</h2>
                                    <p className="text-primary font-semibold text-sm mb-6">{employee.role}</p>

                                    <div className="flex flex-col gap-3 text-left bg-secondary/30 p-4 rounded-2xl border border-border/50">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail size={16} className="text-muted-foreground shrink-0" />
                                            <span className="text-foreground/80 truncate">{employee.email}</span>
                                        </div>
                                        {employee.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <Phone size={16} className="text-muted-foreground shrink-0" />
                                                <span className="text-foreground/80">{employee.phone}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 text-sm">
                                            <MapPin size={16} className="text-muted-foreground shrink-0" />
                                            <span className="text-foreground/80">{employee.location || 'Bangalore, India'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Calendar size={16} className="text-muted-foreground shrink-0" />
                                            <span className="text-foreground/80">Joined {employee.joined}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Department & Role</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={18} className="text-primary" />
                                        <span className="text-sm font-medium">Department</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{employee.department}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Shield size={18} className="text-purple-500" />
                                        <span className="text-sm font-medium">Clearance</span>
                                    </div>
                                    <span className={cn(
                                        "text-xs px-2 py-0.5 rounded-full font-bold",
                                        employee.isAdmin ? "bg-purple-500/10 text-purple-500" : "bg-emerald-500/10 text-emerald-500"
                                    )}>
                                        {employee.isAdmin ? 'Admin' : 'Member'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-blue-500" />
                                        <span className="text-sm font-medium">Username (ID)</span>
                                    </div>
                                    <span className="text-xs font-mono bg-card px-2 py-1 rounded">{employee.employeeId || employee.loginId || 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, i) => (
                                <Card key={i} className="hover:border-primary/20 transition-all group">
                                    <CardContent className="p-6">
                                        <div className={`p-2 rounded-lg w-fit mb-4 bg-secondary group-hover:bg-primary/5 transition-colors`}>
                                            <stat.icon size={20} className={stat.color} />
                                        </div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>About {employee.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed break-words">
                                    {employee.bio || `No bio available for ${employee.name}.`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <CardTitle>Recent Documents</CardTitle>
                                <button className="text-xs font-bold text-primary hover:underline">View All</button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {[
                                        { name: 'Performance Review Q4.pdf', size: '2.4 MB', date: '2 days ago' },
                                        { name: 'Annual Contract 2024.pdf', size: '1.1 MB', date: '1 month ago' },
                                        { name: 'Technical Assessment.docx', size: '840 KB', date: 'Jan 12' }
                                    ].map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{doc.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{doc.size} • {doc.date}</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold hover:text-primary transition-colors">Download</button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !saving && setIsEditing(false)}></div>
                    <div className="bg-card w-full max-w-2xl rounded-2xl border-2 border-primary/5 shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold">Edit Profile</h3>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Role</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.role || ''}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                                    <input
                                        type="text"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location || ''}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.department || ''}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio / About</label>
                                <textarea
                                    rows={3}
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                />
                            </div>

                            <div className="h-[1px] bg-border my-6"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary">Username (Employee ID)</label>
                                    <input
                                        type="text"
                                        value={formData.employeeId || formData.loginId || ''}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        className="w-full bg-card border-2 border-primary/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
                                        placeholder="e.g. EMP101"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password || ''}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-card border-2 border-primary/20 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none pr-10"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Access Level</label>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div
                                        onClick={() => setFormData({ ...formData, isAdmin: true })}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                                            formData.isAdmin ? "bg-primary/10 border-primary" : "bg-secondary/50 border-transparent hover:border-primary/20"
                                        )}
                                    >
                                        <Shield className={cn("w-4 h-4", formData.isAdmin ? "text-primary" : "text-muted-foreground")} />
                                        <span className="text-xs font-bold">Admin</span>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, isAdmin: false })}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                                            !formData.isAdmin ? "bg-emerald-500/10 border-emerald-500" : "bg-secondary/50 border-transparent hover:border-primary/20"
                                        )}
                                    >
                                        <User className={cn("w-4 h-4", !formData.isAdmin ? "text-emerald-500" : "text-muted-foreground")} />
                                        <span className="text-xs font-bold">Staff</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-8">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-xl font-bold bg-secondary hover:bg-secondary/70 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-10 py-3 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout >
    );
}
