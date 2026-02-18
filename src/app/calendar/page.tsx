import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Array(35).fill(null).map((_, i) => i - 2); // Simple representation

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
                        <p className="text-muted-foreground mt-1">Schedule and manage your team's tasks and events.</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 w-fit">
                        <Plus size={18} /> New Event
                    </button>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>March 2024</CardTitle>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-secondary rounded-md transition-colors"><ChevronLeft size={20} /></button>
                            <button className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors border">Today</button>
                            <button className="p-2 hover:bg-secondary rounded-md transition-colors"><ChevronRight size={20} /></button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-px bg-border border rounded-xl overflow-hidden">
                            {days.map(day => (
                                <div key={day} className="bg-secondary/50 p-4 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                            {date.map((d, i) => (
                                <div key={i} className="bg-card min-h-[120px] p-4 group hover:bg-primary/5 transition-colors cursor-pointer border-t first:border-l">
                                    <span className={`text-sm font-semibold ${d < 1 || d > 31 ? 'text-muted-foreground/30' : ''}`}>
                                        {d < 1 ? 28 + d : d > 31 ? d - 31 : d}
                                    </span>
                                    {/* Empty state - no events */}
                                </div>
                            ))}
                        </div>
                        {/* Added an empty state message if needed, but the calendar grid itself is clear now */}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
