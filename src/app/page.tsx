'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/ui/stat-card";
import { ProductivityChart } from "@/components/ui/productivity-chart";
import { RecentActivity } from "@/components/ui/recent-activity";
import { GoalsProgress } from "@/components/ui/goals-progress";
import {
  CheckSquare,
  Layers,
  Users,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

export default function Home() {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserName(JSON.parse(user).name);
    } else if (localStorage.getItem('userRole') === 'admin') {
      setUserName('HR Admin');
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value="0"
            icon={CheckSquare}
            trend={{ value: 0, isUp: true }}
            color="bg-blue-500/10 text-blue-500"
          />
          <StatCard
            title="Active Projects"
            value="0"
            icon={Layers}
            trend={{ value: 0, isUp: true }}
            color="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard
            title="Team Members"
            value="1"
            icon={Users}
            color="bg-purple-500/10 text-purple-500"
          />
          <StatCard
            title="New Messages"
            value="0"
            icon={MessageSquare}
            trend={{ value: 0, isUp: true }}
            color="bg-amber-500/10 text-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProductivityChart empty />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GoalsProgress empty />
            </div>
          </div>
          <div className="h-full">
            <RecentActivity empty />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
