import { DashboardLayout } from "@/components/dashboard-layout";
import { ProjectCard } from "@/components/ui/project-card";
import { Plus, Search, Filter, Layers } from 'lucide-react';

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                        <p className="text-muted-foreground mt-1">Monitor all active projects and team progress.</p>
                    </div>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 w-fit">
                        <Plus size={18} /> New Project
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                className="w-full bg-secondary py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-lg hover:bg-secondary transition-colors">
                            <Filter size={16} /> Filter
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-primary border-b-2 border-primary pb-1 flex items-center gap-2 cursor-pointer">All Projects <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">0</span></span>
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors pb-1">Completed</span>
                        <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors pb-1">Archived</span>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed rounded-3xl text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                        <Layers size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-8">Start by creating your first project to manage tasks and track progress with your team.</p>
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2">
                        <Plus size={18} /> Create First Project
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
