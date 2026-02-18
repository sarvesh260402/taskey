import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield, Palette, Globe, Mail } from 'lucide-react';

export default function SettingsPage() {
    const sections = [
        { name: 'Profile', icon: User, description: 'Manage your public profile and personal information.' },
        { name: 'Notifications', icon: Bell, description: 'Configure how you receive alerts and updates.' },
        { name: 'Security', icon: Shield, description: 'Update your password and manage account security.' },
        { name: 'Appearance', icon: Palette, description: 'Customize your dashboard theme and layout.' },
        { name: 'Language', icon: Globe, description: 'Set your preferred language and region.' },
        { name: 'Email', icon: Mail, description: 'Manage your email preferences and forwarding.' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your account preferences and application settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-2">
                        {sections.map(section => (
                            <button
                                key={section.name}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${section.name === 'Profile' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                            >
                                <section.icon size={18} />
                                {section.name}
                            </button>
                        ))}
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Public Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-8 pb-6 border-b">
                                    <div className="w-24 h-24 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold shadow-xl">
                                        S
                                    </div>
                                    <div className="space-y-3">
                                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">Change Avatar</button>
                                        <button className="block text-sm text-destructive font-medium hover:underline">Remove photo</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Full Name</label>
                                        <input type="text" defaultValue="Sarvesh" className="w-full bg-secondary border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Email</label>
                                        <input type="email" defaultValue="sarvesh@example.com" className="w-full bg-secondary border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold">Bio</label>
                                        <textarea defaultValue="Full-stack developer with a passion for building beautiful and functional user interfaces." className="w-full bg-secondary border-none rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all h-32 resize-none" />
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end gap-3">
                                    <button className="px-6 py-2 border rounded-lg text-sm font-semibold hover:bg-secondary transition-all">Cancel</button>
                                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all">Save Changes</button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/20 bg-destructive/5 shrink-0">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
                                <button className="bg-destructive text-destructive-foreground px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">Delete Account</button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
