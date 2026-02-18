import React from 'react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    className?: string;
    color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className, color }: StatCardProps) {
    return (
        <Card className={cn("overflow-hidden group", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className={cn(
                        "p-3 rounded-xl transition-colors duration-300",
                        color || "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    )}>
                        <Icon size={24} />
                    </div>
                </div>
                {trend && (
                    <div className="mt-4 flex items-center gap-2">
                        <span className={cn(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            trend.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                        )}>
                            {trend.isUp ? "+" : "-"}{trend.value}%
                        </span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
