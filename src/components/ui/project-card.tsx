import React from 'react';
import { Card, CardContent } from './card';
import { MoreHorizontal, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
    name: string;
    category: string;
    progress: number;
    members: number;
    dueDate: string;
    status: 'On Track' | 'At Risk' | 'Delayed';
}

const statusStyles = {
    'On Track': 'bg-emerald-500/10 text-emerald-500',
    'At Risk': 'bg-amber-500/10 text-amber-500',
    'Delayed': 'bg-destructive/10 text-destructive',
};

export function ProjectCard({ name, category, progress, members, dueDate, status }: ProjectCardProps) {
    return (
        <Card className="group">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-secondary rounded-full mb-2 inline-block">
                            {category}
                        </span>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{name}</h3>
                    </div>
                    <button className="p-1 hover:bg-secondary rounded-md text-muted-foreground">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Users size={16} />
                                <span className="text-xs font-medium">{members} members</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Calendar size={16} />
                                <span className="text-xs font-medium">{dueDate}</span>
                            </div>
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            statusStyles[status]
                        )}>
                            {status}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
