import React from 'react';
import { Navbar } from '@/components/Navbar';
import { SwapCard } from '@/components/SwapCard';
import { StatsCards } from '@/components/StatsCards';
import { QuickActions } from '@/components/QuickActions';
import { TrendingPools } from '@/components/TrendingPools';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            The Future of Solana DeFi
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the fastest, most efficient DEX on Solana. Swap, farm, and earn with minimal fees and maximum yield.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Swap Card */}
          <div className="lg:col-span-1">
            <SwapCard />
          </div>

          {/* Right Side Content */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <TrendingPools />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center text-muted-foreground">
          <p>Powered by W Swap • Built on Solana • Audited by CertiK</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
