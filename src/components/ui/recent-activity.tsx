import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { CheckCircle2, MessageSquare, Clock, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
    {
        id: 1,
        type: 'task',
        content: 'Sarvesh completed',
        target: 'Dashboard Redesign',
        time: '2 hours ago',
        icon: CheckCircle2,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-500/10'
    },
    {
        id: 2,
        type: 'comment',
        content: 'Anvitha commented on',
        target: 'Project Alpha',
        time: '4 hours ago',
        icon: MessageSquare,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10'
    },
    {
        id: 3,
        type: 'user',
        content: 'New member joined',
        target: 'Team UI/UX',
        time: 'Yesterday',
        icon: UserPlus,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-500/10'
    },
    {
        id: 4,
        type: 'task',
        content: 'Task moved to In Progress',
        target: 'API Integration',
        time: '2 days ago',
        icon: Clock,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-500/10'
    }
];

export function RecentActivity({ empty }: { empty?: boolean }) {
    const displayedActivities = empty ? [] : activities;
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {displayedActivities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Clock className="w-12 h-12 text-muted-foreground/20 mb-4" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                ) : (
                    <>
                        {displayedActivities.map((activity) => (
                            <div key={activity.id} className="flex gap-4">
                                <div className={cn("p-2 rounded-lg h-fit mt-0.5", activity.iconBg, activity.iconColor)}>
                                    <activity.icon size={18} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm">
                                        <span className="font-medium">{activity.content}</span>{' '}
                                        <span className="text-primary hover:underline cursor-pointer">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 text-sm text-primary font-medium hover:bg-secondary rounded-lg transition-colors">
                            View All Activity
                        </button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
