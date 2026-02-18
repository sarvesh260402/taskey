'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './card';

const emptyData = [
    { name: 'Mon', tasks: 0, productivity: 0 },
    { name: 'Tue', tasks: 0, productivity: 0 },
    { name: 'Wed', tasks: 0, productivity: 0 },
    { name: 'Thu', tasks: 0, productivity: 0 },
    { name: 'Fri', tasks: 0, productivity: 0 },
    { name: 'Sat', tasks: 0, productivity: 0 },
    { name: 'Sun', tasks: 0, productivity: 0 },
];

const mockData = [
    { name: 'Mon', tasks: 40, productivity: 24 },
    { name: 'Tue', tasks: 30, productivity: 13 },
    { name: 'Wed', tasks: 20, productivity: 98 },
    { name: 'Thu', tasks: 27, productivity: 39 },
    { name: 'Fri', tasks: 18, productivity: 48 },
    { name: 'Sat', tasks: 23, productivity: 38 },
    { name: 'Sun', tasks: 34, productivity: 43 },
];

export function ProductivityChart({ empty }: { empty?: boolean }) {
    const data = empty ? emptyData : mockData;
    return (
        <Card className="h-[400px]">
            <CardHeader>
                <CardTitle>Productivity Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="tasks"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTasks)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
