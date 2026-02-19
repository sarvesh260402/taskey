'use client';

import { DashboardLayout } from "@/components/dashboard-layout";
import { Plus, Search, Filter, Layers, X, Loader2, Users, CalendarDays, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Project {
    _id: string;
    name: string;
    category: string;
    progress: number;
    members: number;
    dueDate?: string;
    status: 'On Track' | 'At Risk' | 'Delayed';
    description?: string;
    createdAt: string;
}

const statusColor: Record<string, string> = {
    'On Track': 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20',
    'At Risk': 'bg-amber-500/15 text-amber-500 border-amber-500/20',
    'Delayed': 'bg-red-500/15 text-red-500 border-red-500/20',
};

const progressColor: Record<string, string> = {
    'On Track': 'bg-emerald-500',
    'At Risk': 'bg-amber-500',
    'Delayed': 'bg-red-500',
};

export default function ProjectsPage() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'completed' | 'archived'>('all');
    const [form, setForm] = useState({
        name: '',
        category: '',
        description: '',
        dueDate: '',
        status: 'On Track' as string,
        members: 1,
    });

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setIsAdmin(role === 'admin');
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!form.name || !form.category) return;
        setCreating(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setShowModal(false);
                setForm({ name: '', category: '', description: '', dueDate: '', status: 'On Track', members: 1 });
                fetchProjects();
            }
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setCreating(false);
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        if (filterTab === 'completed') return matchesSearch && p.progress === 100;
        if (filterTab === 'archived') return matchesSearch && p.status === 'Delayed';
        return matchesSearch;
    });

    const counts = {
        all: projects.length,
        completed: projects.filter(p => p.progress === 100).length,
        archived: projects.filter(p => p.status === 'Delayed').length,
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                        <p className="text-muted-foreground mt-1">Monitor all active projects and team progress.</p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 w-fit"
                        >
                            <Plus size={18} /> New Project
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary py-2 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium">
                        {(['all', 'completed', 'archived'] as const).map(tab => (
                            <span
                                key={tab}
                                onClick={() => setFilterTab(tab)}
                                className={`cursor-pointer pb-1 flex items-center gap-2 transition-colors ${filterTab === tab
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab === 'all' ? 'All Projects' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                <span className="text-xs bg-primary/10 px-2 py-0.5 rounded-full">{counts[tab]}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Project Grid / Empty State */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed rounded-3xl text-center">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                            <Layers size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No projects yet</h3>
                        <p className="text-muted-foreground max-w-sm mb-8">Start by creating your first project to manage tasks and track progress with your team.</p>
                        {isAdmin && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                            >
                                <Plus size={18} /> Create First Project
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div
                                key={project._id}
                                className="bg-card border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">{project.category}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColor[project.status]}`}>
                                        {project.status}
                                    </span>
                                </div>

                                {project.description && (
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                                )}

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                            <TrendingUp size={12} /> Progress
                                        </span>
                                        <span className="text-xs font-bold">{project.progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${progressColor[project.status]}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                    <span className="flex items-center gap-1.5">
                                        <Users size={13} /> {project.members} member{project.members > 1 ? 's' : ''}
                                    </span>
                                    {project.dueDate && (
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays size={13} /> {project.dueDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-lg font-bold">Create New Project</h2>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Website Redesign"
                                    className="w-full mt-1.5 px-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category *</label>
                                <input
                                    type="text"
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    placeholder="e.g. Design, Development, Marketing"
                                    className="w-full mt-1.5 px-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description of the project..."
                                    rows={3}
                                    className="w-full mt-1.5 px-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Due Date</label>
                                    <input
                                        type="date"
                                        value={form.dueDate}
                                        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                        className="w-full mt-1.5 px-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Members</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.members}
                                        onChange={(e) => setForm({ ...form, members: parseInt(e.target.value) || 1 })}
                                        className="w-full mt-1.5 px-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full mt-1.5 px-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                >
                                    <option value="On Track">On Track</option>
                                    <option value="At Risk">At Risk</option>
                                    <option value="Delayed">Delayed</option>
                                </select>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={creating || !form.name || !form.category}
                                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                {creating ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
