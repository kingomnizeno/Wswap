import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Settings, TrendingUp, Info, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokens } from '@/hooks/useTokens';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useJupiterSwap } from '@/hooks/useJupiterSwap';
import { toast } from '@/hooks/use-toast';

export const SwapCard = () => {
  const { publicKey, connected } = useWallet();
  const { tokens } = useTokens();
  const { getBalance, fetchBalances } = useTokenBalance();
  const { getQuote, executeSwap, quote, loading: swapLoading } = useJupiterSwap();
  
  const [fromToken, setFromToken] = useState('So11111111111111111111111111111111111111112'); // SOL
  const [toToken, setToToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isGettingQuote, setIsGettingQuote] = useState(false);

  const fromTokenData = useMemo(() => tokens.find(t => t.address === fromToken), [tokens, fromToken]);
  const toTokenData = useMemo(() => tokens.find(t => t.address === toToken), [tokens, toToken]);
  
  const fromBalance = getBalance(fromToken);
  const toBalance = getBalance(toToken);

  // Fetch balances when wallet connects or tokens change
  useEffect(() => {
    if (connected && tokens.length > 0) {
      fetchBalances(tokens);
    }
  }, [connected, tokens, fetchBalances]);

  // Get quote when amount or tokens change
  useEffect(() => {
    const getSwapQuote = async () => {
      if (!fromAmount || !fromTokenData || !toTokenData || parseFloat(fromAmount) <= 0) {
        setToAmount('');
        return;
      }

      setIsGettingQuote(true);
      try {
        const amount = parseFloat(fromAmount) * Math.pow(10, fromTokenData.decimals);
        const quoteData = await getQuote({
          inputMint: fromToken,
          outputMint: toToken,
          amount: Math.floor(amount),
          slippageBps: parseInt(slippage) * 100, // Convert percentage to basis points
        });

        if (quoteData && toTokenData) {
          const outputAmount = parseInt(quoteData.outAmount) / Math.pow(10, toTokenData.decimals);
          setToAmount(outputAmount.toString());
        }
      } catch (error) {
        console.error('Error getting quote:', error);
        setToAmount('');
      } finally {
        setIsGettingQuote(false);
      }
    };

    const debounceTimer = setTimeout(getSwapQuote, 500);
    return () => clearTimeout(debounceTimer);
  }, [fromAmount, fromToken, toToken, slippage, fromTokenData, toTokenData, getQuote]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    if (!connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to perform swaps.',
        variant: 'destructive',
      });
      return;
    }

    if (!quote) {
      toast({
        title: 'No Quote Available',
        description: 'Please enter an amount to get a quote first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await executeSwap(quote);
      // Refresh balances after successful swap
      if (tokens.length > 0) {
        fetchBalances(tokens);
      }
      // Clear amounts
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      console.error('Swap failed:', error);
    }
  };

  const formatBalance = (balance: number) => {
    if (balance === 0) return '0';
    if (balance < 0.001) return '<0.001';
    return balance.toFixed(6);
  };

  const priceImpact = quote ? parseFloat(quote.priceImpactPct) : 0;
  const minimumReceived = quote && toTokenData 
    ? (parseInt(quote.otherAmountThreshold) / Math.pow(10, toTokenData.decimals)).toFixed(6)
    : '0';

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
            <span>
              Balance: {fromBalance ? formatBalance(fromBalance.uiAmount) : '0'} {fromTokenData?.symbol}
            </span>
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
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-24 border-none bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center gap-2">
                        {token.logoURI ? (
                          <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full gradient-primary"></div>
                        )}
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:scale-110 transition-transform"
            onClick={handleSwapTokens}
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>To</span>
            <span>
              Balance: {toBalance ? formatBalance(toBalance.uiAmount) : '0'} {toTokenData?.symbol}
            </span>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="text-2xl h-16 pr-32 border-border bg-secondary/50"
            />
            {isGettingQuote && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-24 border-none bg-background/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center gap-2">
                        {token.logoURI ? (
                          <img src={token.logoURI} alt={token.symbol} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full gradient-primary"></div>
                        )}
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {quote && (
          <>
            <Separator />

            {/* Swap Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rate</span>
                <div className="flex items-center gap-1">
                  <span>
                    1 {fromTokenData?.symbol} = {toAmount && fromAmount ? 
                      (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4) : '0'
                    } {toTokenData?.symbol}
                  </span>
                  <TrendingUp className="w-3 h-3 text-success" />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Price Impact</span>
                <span className={priceImpact > 1 ? 'text-destructive' : 'text-success'}>
                  {priceImpact.toFixed(2)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Minimum Received</span>
                <span>{minimumReceived} {toTokenData?.symbol}</span>
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
          </>
        )}

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
        <Button 
          variant="glow" 
          size="lg" 
          className="w-full" 
          onClick={handleSwap}
          disabled={!connected || !quote || swapLoading || isGettingQuote || !fromAmount}
        >
          {swapLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Swapping...
            </>
          ) : !connected ? (
            'Connect Wallet'
          ) : !fromAmount ? (
            'Enter Amount'
          ) : !quote ? (
            'Getting Quote...'
          ) : (
            'Swap'
          )}
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          Powered by Jupiter • Real Solana Network
        </div>
      </CardContent>
    </Card>
  );
};