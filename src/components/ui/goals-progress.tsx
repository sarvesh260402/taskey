import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';

const goals = [
    { name: 'Tasks Completed', current: 45, total: 60, color: 'bg-blue-500' },
    { name: 'Projects Delivered', current: 12, total: 15, color: 'bg-emerald-500' },
    { name: 'Team Productivity', current: 85, total: 100, color: 'bg-purple-500' },
    { name: 'Upcoming Deadlines', current: 4, total: 10, color: 'bg-amber-500' },
];

export function GoalsProgress({ empty }: { empty?: boolean }) {
    const displayedGoals = empty ? goals.map(g => ({ ...g, current: 0 })) : goals;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quarterly Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {displayedGoals.map((goal) => {
                    const percentage = Math.round((goal.current / goal.total) * 100);
                    return (
                        <div key={goal.name} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{goal.name}</span>
                                <span className="text-muted-foreground">{goal.current}/{goal.total}</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all duration-500", goal.color)}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-right text-muted-foreground font-semibold">
                                {percentage}% Progress
                            </p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
