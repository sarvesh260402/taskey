'use client';

import React, { useRef, useState } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Shield, Briefcase, Camera, ArrowLeft, X, Lock, Key, Loader2, CheckCircle2, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function AddEmployeePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        employeeId: '',
        password: '',
        status: 'Active',
        isAdmin: false,
        bio: '',
        phone: '',
        location: ''
    });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const removePhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '';

            // 1. Upload file if selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (!uploadRes.ok) throw new Error('Failed to upload image');
                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            // 2. Create employee in DB
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    avatar: formData.name.charAt(0).toUpperCase(),
                    image: imageUrl
                })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/employees'), 1500);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add employee');
            }
        } catch (err: any) {
            setError(err.message || 'Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-12">
                <div className="flex items-center gap-4">
                    <Link href="/employees" className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Add Employee</h1>
                        <p className="text-muted-foreground mt-1">Onboard a new member to your workspace.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="border-2 border-primary/5 shadow-xl">
                            <CardHeader>
                                <CardTitle>Member Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="e.g. Rahul Kumar"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="rahul@example.com"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-primary/80">Username (Employee ID)</label>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.employeeId}
                                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                                placeholder="e.g. EMP101"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-primary/80">Login Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none pr-12"
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
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+91 98765 43210"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Office Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="e.g. Bangalore, India"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Role / Position</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                placeholder="e.g. Senior Frontend Developer"
                                                className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Department</label>
                                        <select
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full bg-secondary border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                                            required
                                        >
                                            <option value="" disabled>Select Department</option>
                                            <option>Engineering</option>
                                            <option>Design</option>
                                            <option>Product</option>
                                            <option>Marketing</option>
                                            <option>Sales</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 space-y-2 pt-4">
                                        <label className="text-sm font-semibold">Short Bio</label>
                                        <textarea
                                            placeholder="Write a brief professional background..."
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full bg-secondary border-none rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[100px] resize-none"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2 pt-4 border-t">
                                        <label className="text-sm font-semibold">User Access Level</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <div
                                                onClick={() => setFormData({ ...formData, isAdmin: true })}
                                                className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                                                    formData.isAdmin ? "bg-primary/10 border-primary" : "bg-secondary/50 border-transparent hover:border-primary/20"
                                                )}
                                            >
                                                <Shield className={cn("w-5 h-5", formData.isAdmin ? "text-primary" : "text-muted-foreground")} />
                                                <div>
                                                    <p className="text-xs font-bold">Admin Access</p>
                                                    <p className="text-[10px] text-muted-foreground">Full workspace management.</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setFormData({ ...formData, isAdmin: false })}
                                                className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                                                    !formData.isAdmin ? "bg-emerald-500/10 border-emerald-500" : "bg-secondary/50 border-transparent hover:border-primary/20"
                                                )}
                                            >
                                                <User className={cn("w-5 h-5", !formData.isAdmin ? "text-emerald-500" : "text-muted-foreground")} />
                                                <div>
                                                    <p className="text-xs font-bold">Employee Access</p>
                                                    <p className="text-[10px] text-muted-foreground">View and manage tasks.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg">
                                        {error}
                                    </p>
                                )}

                                <div className="pt-6 border-t flex flex-col md:flex-row justify-end gap-3">
                                    <Link href="/employees" className="px-6 py-2.5 border rounded-xl text-sm font-semibold hover:bg-secondary transition-all text-center">
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading || success}
                                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-50"
                                    >
                                        {success ? (
                                            <><CheckCircle2 size={18} /> Added Successfully</>
                                        ) : loading ? (
                                            <><Loader2 className="animate-spin" size={18} /> Saving...</>
                                        ) : (
                                            "Add Member"
                                        )}
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 border-none bg-transparent">
                        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-dashed border-2 border-primary/20 shadow-none hover:shadow-none translate-y-0 hover:translate-y-0">
                            <CardContent className="p-8 text-center">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={handleUploadClick}
                                    className="w-32 h-32 bg-card rounded-3xl mx-auto mb-6 flex items-center justify-center relative group cursor-pointer border shadow-sm overflow-hidden"
                                >
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <button
                                                    onClick={removePhoto}
                                                    type="button"
                                                    className="p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 shadow-lg"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <Camera size={32} />
                                            </div>
                                            <div className="absolute inset-0 bg-primary/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                <p className="text-xs font-bold">Upload Photo</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <h4 className="font-bold">Employee Photo</h4>
                                <p className="text-xs text-muted-foreground mt-2 max-w-[200px] mx-auto leading-relaxed">
                                    {previewUrl
                                        ? "Photo selected! It will be saved to the server image folder."
                                        : "Click above to select a photo. It will be stored in the server's image folder."}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
