'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        // Admin hardcoded credentials
        if (employeeId === 'hradmin' && password === 'hr123') {
            setSuccessMsg('Login successful');
            localStorage.setItem('userRole', 'admin');
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => router.push('/'), 1500);
            return;
        }

        try {
            // Try employee login from API
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ employeeId, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMsg('Login successful');
                const isAdmin = data.user.isAdmin === true;
                localStorage.setItem('userRole', isAdmin ? 'admin' : 'employee');
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                setTimeout(() => router.push('/'), 1500);
            } else {
                setError(data.error || 'Invalid ID or Password');
                setLoading(false);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Access Portal</h1>
                    <p className="text-muted-foreground">Admin or Employee? Please enter your credentials.</p>
                </div>

                <Card className="border-2 border-primary/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Username (Employee ID)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        placeholder="e.g. EMP101"
                                        className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-secondary border-none rounded-lg px-10 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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

                            {successMsg && (
                                <p className="text-sm font-medium text-emerald-500 bg-emerald-500/10 p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                    <CheckCircle2 size={16} />
                                    {successMsg}
                                </p>
                            )}

                            {error && (
                                <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg flex items-center gap-2">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <>Sign In </>
                                )}
                            </button>
                        </form>
                    </CardContent>
                </Card>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center">
                    <p className="text-xs text-muted-foreground italic">
                        Employees: Use the Username and Password provided by your HR Admin.
                    </p>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    Protected by Taskey Identity Management
                </p>
            </div>
        </div>
    );
}
