'use client';

import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { MoreVertical, Plus, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Priority = 'low' | 'medium' | 'high';
type Status = 'backlog' | 'todo' | 'in-progress' | 'done';

interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: string;
    assignee: string;
}

const statusColumns: { id: Status; label: string }[] = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' }
];

const priorityStyles = {
    low: 'bg-blue-500/10 text-blue-500',
    medium: 'bg-amber-500/10 text-amber-500',
    high: 'bg-destructive/10 text-destructive'
};

export function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]); // Empty initial tasks

    const getTasksByStatus = (status: Status) => tasks.filter(t => t.status === status);

    return (
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6">
            {statusColumns.map((column) => (
                <div key={column.id} className="min-w-[300px] flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{column.label}</h3>
                            <span className="bg-secondary text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                                {getTasksByStatus(column.id).length}
                            </span>
                        </div>
                        <button className="p-1 hover:bg-secondary rounded-md text-muted-foreground transition-colors">
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4 min-h-[500px]">
                        {getTasksByStatus(column.id).map((task) => (
                            <motion.div
                                key={task.id}
                                layoutId={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group cursor-grab active:cursor-grabbing"
                            >
                                <Card className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                            priorityStyles[task.priority]
                                        )}>
                                            {task.priority}
                                        </span>
                                        <button className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                                            {task.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {task.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-medium">{task.dueDate}</span>
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                            {task.assignee.charAt(0)}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}

                        {getTasksByStatus(column.id).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                                <p className="text-xs font-medium italic">Empty</p>
                            </div>
                        )}

                        <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:bg-secondary/50 hover:border-primary/50 hover:text-primary transition-all text-xs font-medium flex items-center justify-center gap-2">
                            <Plus size={14} /> Add Task
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
