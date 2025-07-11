import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Flame, ExternalLink } from 'lucide-react';

export const TrendingPools = () => {
  const pools = [
    {
      pair: 'SOL/USDC',
      apy: '24.5%',
      tvl: '$45.2M',
      volume24h: '$12.3M',
      change: '+15.2%',
      trend: 'up',
      hot: true
    },
    {
      pair: 'RAY/SOL',
      apy: '32.1%',
      tvl: '$18.7M',
      volume24h: '$5.8M',
      change: '+8.7%',
      trend: 'up',
      hot: true
    },
    {
      pair: 'BONK/SOL',
      apy: '45.3%',
      tvl: '$8.4M',
      volume24h: '$2.1M',
      change: '-2.3%',
      trend: 'down',
      hot: false
    },
    {
      pair: 'USDT/USDC',
      apy: '12.8%',
      tvl: '$67.1M',
      volume24h: '$18.9M',
      change: '+1.2%',
      trend: 'up',
      hot: false
    }
  ];

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Trending Pools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pools.map((pool, index) => (
            <div
              key={pool.pair}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 hover:scale-[1.02] animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary"></div>
                    <div className="w-6 h-6 rounded-full bg-secondary -ml-2 border-2 border-background"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{pool.pair}</span>
                      {pool.hot && (
                        <Badge variant="outline" className="text-xs text-warning border-warning/30">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>APY: <span className="text-success font-medium">{pool.apy}</span></span>
                      <span>TVL: {pool.tvl}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`flex items-center gap-1 ${
                    pool.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {pool.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-medium">{pool.change}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vol: {pool.volume24h}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  Add Liquidity
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          View All Pools
        </Button>
      </CardContent>
    </Card>
  );
};