import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Activity, Users } from 'lucide-react';

export const StatsCards = () => {
  const stats = [
    {
      title: 'Total Value Locked',
      value: '$2.4B',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: '24h Volume',
      value: '$156M',
      change: '+8.2%',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Total Pools',
      value: '1,247',
      change: '+23',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: '45K',
      change: '+15.3%',
      icon: Users,
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={stat.title} className="glass-effect hover:scale-105 transition-transform duration-200 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};