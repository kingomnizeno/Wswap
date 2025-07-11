import { useState, useEffect } from 'react';

export interface Token {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  tags?: string[];
  verified?: boolean;
}

const POPULAR_TOKENS: Token[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    chainId: 101,
    decimals: 9,
    name: 'Wrapped SOL',
    symbol: 'SOL',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    verified: true,
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    chainId: 101,
    decimals: 6,
    name: 'USD Coin',
    symbol: 'USDC',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    verified: true,
  },
  {
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    chainId: 101,
    decimals: 6,
    name: 'Raydium',
    symbol: 'RAY',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
    verified: true,
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    chainId: 101,
    decimals: 6,
    name: 'Tether',
    symbol: 'USDT',
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
    verified: true,
  },
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    chainId: 101,
    decimals: 5,
    name: 'Bonk',
    symbol: 'BONK',
    logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    verified: true,
  },
  {
    address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    chainId: 101,
    decimals: 9,
    name: 'Jito Staked SOL',
    symbol: 'JitoSOL',
    logoURI: 'https://storage.googleapis.com/jito-app-assets/jito_staked_sol_logo.png',
    verified: true,
  },
];

export const useTokens = () => {
  const [tokens, setTokens] = useState<Token[]>(POPULAR_TOKENS);
  const [loading, setLoading] = useState(false);

  const fetchTokenList = async () => {
    setLoading(true);
    try {
      // Using Solana Token Registry
      const response = await fetch('https://token.jup.ag/strict');
      const tokenList = await response.json();
      
      // Filter for verified tokens and add popular tokens first
      const verifiedTokens = tokenList.filter((token: Token) => 
        token.verified && token.chainId === 101
      );
      
      // Combine popular tokens with other verified tokens
      const uniqueTokens = [...POPULAR_TOKENS];
      const popularAddresses = new Set(POPULAR_TOKENS.map(t => t.address));
      
      verifiedTokens.forEach((token: Token) => {
        if (!popularAddresses.has(token.address)) {
          uniqueTokens.push(token);
        }
      });
      
      setTokens(uniqueTokens.slice(0, 100)); // Limit to 100 tokens for performance
    } catch (error) {
      console.error('Failed to fetch token list:', error);
      // Fallback to popular tokens
      setTokens(POPULAR_TOKENS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenList();
  }, []);

  return { tokens, loading, refetch: fetchTokenList };
};