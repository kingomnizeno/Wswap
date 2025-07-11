import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-border backdrop-blur-sm bg-card/50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center glow-primary">
            <span className="text-xl font-bold text-primary-foreground">W</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">W Swap</h1>
            <Badge variant="outline" className="text-xs">V3</Badge>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <Button variant="ghost" size="sm">Swap</Button>
        <Button variant="ghost" size="sm">Liquidity</Button>
        <Button variant="ghost" size="sm">Portfolio</Button>
        <Button variant="ghost" size="sm">Staking</Button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        
        {/* Solana Wallet Connection Button */}
        <div className="wallet-adapter-button-container">
          <WalletMultiButton className="wallet-adapter-button-trigger" />
        </div>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
};