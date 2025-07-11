import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Droplets, TrendingUp, Zap, Plus, Target } from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      icon: ArrowRightLeft,
      title: 'Swap',
      description: 'Trade tokens instantly',
      badge: 'Popular',
      color: 'primary'
    },
    {
      icon: Droplets,
      title: 'Add Liquidity',
      description: 'Earn fees by providing liquidity',
      badge: 'APY up to 45%',
      color: 'success'
    },
    {
      icon: TrendingUp,
      title: 'Farm',
      description: 'Stake LP tokens for rewards',
      badge: 'High Yield',
      color: 'warning'
    },
    {
      icon: Zap,
      title: 'Concentrated Liquidity',
      description: 'Maximize capital efficiency',
      badge: 'V3 Feature',
      color: 'primary'
    }
  ];

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <div
              key={action.title}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:scale-105 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  action.color === 'primary' ? 'bg-primary/10 text-primary' :
                  action.color === 'success' ? 'bg-success/10 text-success' :
                  'bg-warning/10 text-warning'
                }`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {action.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};