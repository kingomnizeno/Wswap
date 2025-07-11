import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Settings, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const SwapCard = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const tokens = [
    { symbol: 'SOL', name: 'Solana', balance: '12.5', price: '$95.42' },
    { symbol: 'USDC', name: 'USD Coin', balance: '1,250.00', price: '$1.00' },
    { symbol: 'RAY', name: 'Raydium', balance: '850.2', price: '$1.25' },
    { symbol: 'BONK', name: 'Bonk', balance: '1,000,000', price: '$0.000025' },
  ];

  return (
    <Card className="w-full max-w-md mx-auto shadow-card glass-effect animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Swap</CardTitle>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>From</span>
            <span>Balance: 12.5 SOL</span>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-2xl h-16 pr-32 border-border bg-secondary/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Select defaultValue="SOL">
                <SelectTrigger className="w-24 border-none bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full gradient-primary"></div>
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">≈ $0.00</div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button variant="outline" size="icon" className="rounded-full hover:scale-110 transition-transform">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>To</span>
            <span>Balance: 1,250.00 USDC</span>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="text-2xl h-16 pr-32 border-border bg-secondary/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Select defaultValue="USDC">
                <SelectTrigger className="w-24 border-none bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full gradient-primary"></div>
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">≈ $0.00</div>
        </div>

        <Separator />

        {/* Swap Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Rate</span>
            <div className="flex items-center gap-1">
              <span>1 SOL = 95.42 USDC</span>
              <TrendingUp className="w-3 h-3 text-success" />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price Impact</span>
            <span className="text-success">{'<'}0.01%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Minimum Received</span>
            <span>0.0 USDC</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Slippage</span>
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">
                {slippage}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="flex gap-2">
          {['0.1', '0.5', '1.0'].map((value) => (
            <Button
              key={value}
              variant={slippage === value ? "default" : "outline"}
              size="sm"
              onClick={() => setSlippage(value)}
              className="flex-1 text-xs"
            >
              {value}%
            </Button>
          ))}
        </div>

        {/* Swap Button */}
        <Button variant="glow" size="lg" className="w-full">
          Swap
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Powered by Jupiter • Fees: 0.25%
        </div>
      </CardContent>
    </Card>
  );
};