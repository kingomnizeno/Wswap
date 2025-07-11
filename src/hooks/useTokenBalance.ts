import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { Token } from './useTokens';

interface TokenBalance {
  mint: string;
  balance: number;
  decimals: number;
  uiAmount: number;
}

export const useTokenBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balances, setBalances] = useState<Map<string, TokenBalance>>(new Map());
  const [loading, setLoading] = useState(false);

  const getTokenBalance = useCallback(async (token: Token): Promise<number> => {
    if (!publicKey) return 0;

    try {
      // Handle SOL (native token)
      if (token.address === 'So11111111111111111111111111111111111111112') {
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
      }

      // Handle SPL tokens
      const mintPubkey = new PublicKey(token.address);
      const associatedTokenAddress = await getAssociatedTokenAddress(mintPubkey, publicKey);
      
      try {
        const tokenAccount = await getAccount(connection, associatedTokenAddress);
        const balance = Number(tokenAccount.amount) / Math.pow(10, token.decimals);
        return balance;
      } catch (error) {
        // Token account doesn't exist, balance is 0
        return 0;
      }
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol}:`, error);
      return 0;
    }
  }, [connection, publicKey]);

  const fetchBalances = useCallback(async (tokens: Token[]) => {
    if (!publicKey) {
      setBalances(new Map());
      return;
    }

    setLoading(true);
    const newBalances = new Map<string, TokenBalance>();

    try {
      // Fetch balances for all tokens in parallel
      const balancePromises = tokens.map(async (token) => {
        const balance = await getTokenBalance(token);
        return {
          mint: token.address,
          balance: balance * Math.pow(10, token.decimals), // Raw balance
          decimals: token.decimals,
          uiAmount: balance, // Human readable balance
        };
      });

      const results = await Promise.all(balancePromises);
      
      results.forEach((result) => {
        newBalances.set(result.mint, result);
      });

      setBalances(newBalances);
    } catch (error) {
      console.error('Error fetching token balances:', error);
    } finally {
      setLoading(false);
    }
  }, [publicKey, getTokenBalance]);

  const getBalance = useCallback((mintAddress: string): TokenBalance | null => {
    return balances.get(mintAddress) || null;
  }, [balances]);

  const refreshBalance = useCallback(async (token: Token) => {
    if (!publicKey) return;

    try {
      const balance = await getTokenBalance(token);
      const tokenBalance: TokenBalance = {
        mint: token.address,
        balance: balance * Math.pow(10, token.decimals),
        decimals: token.decimals,
        uiAmount: balance,
      };

      setBalances(prev => new Map(prev.set(token.address, tokenBalance)));
    } catch (error) {
      console.error(`Error refreshing balance for ${token.symbol}:`, error);
    }
  }, [publicKey, getTokenBalance]);

  return {
    balances,
    loading,
    fetchBalances,
    getBalance,
    refreshBalance,
  };
};