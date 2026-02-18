import { DashboardLayout } from "@/components/dashboard-layout";
import { KanbanBoard } from "@/components/kanban-board";
import { Plus, Filter, Search, LayoutGrid, List } from 'lucide-react';

export default function TasksPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
                        <p className="text-muted-foreground mt-1">Manage and track your team's work progress.</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 w-fit">
                        <Plus size={18} /> New Task
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full bg-secondary py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-secondary transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                    </div>

                    <div className="flex items-center gap-2 border rounded-lg p-1">
                        <button className="p-1.5 rounded-md bg-secondary text-primary">
                            <LayoutGrid size={18} />
                        </button>
                        <button className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary transition-colors">
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <KanbanBoard />
            </div>
        </DashboardLayout>
    );
}
