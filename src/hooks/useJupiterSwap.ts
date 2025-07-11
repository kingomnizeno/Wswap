import { useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';

interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps: number; // basis points (1% = 100 bps)
}

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: any;
  priceImpactPct: string;
  routePlan: any[];
}

export const useJupiterSwap = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  const getQuote = useCallback(async (params: SwapParams): Promise<QuoteResponse | null> => {
    try {
      setLoading(true);
      
      const { inputMint, outputMint, amount, slippageBps } = params;
      
      // Convert amount to lamports/smallest unit
      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?` +
        `inputMint=${inputMint}&` +
        `outputMint=${outputMint}&` +
        `amount=${amount}&` +
        `slippageBps=${slippageBps}`
      );

      if (!response.ok) {
        throw new Error('Failed to get quote');
      }

      const quoteData = await response.json();
      setQuote(quoteData);
      return quoteData;
    } catch (error) {
      console.error('Error getting quote:', error);
      toast({
        title: 'Quote Error',
        description: 'Failed to get swap quote. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSwap = useCallback(async (quoteResponse: QuoteResponse) => {
    if (!publicKey || !signTransaction) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to perform swaps.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      // Get serialized transaction from Jupiter
      const response = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
          // Add your fee account if you want to collect fees
          // feeAccount: "your_fee_account_here"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get swap transaction');
      }

      const { swapTransaction } = await response.json();

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      let transaction: Transaction | VersionedTransaction;

      try {
        // Try to deserialize as VersionedTransaction first
        transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      } catch {
        // Fallback to legacy Transaction
        transaction = Transaction.from(swapTransactionBuf);
      }

      // Sign the transaction
      let signedTransaction;
      if (transaction instanceof VersionedTransaction) {
        // For versioned transactions, we need to handle signing differently
        const latestBlockHash = await connection.getLatestBlockhash();
        transaction.message.recentBlockhash = latestBlockHash.blockhash;
        
        // Note: This might need adjustment based on your wallet adapter version
        signedTransaction = await signTransaction(transaction as any);
      } else {
        // For legacy transactions
        const latestBlockHash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockHash.blockhash;
        transaction.feePayer = publicKey;
        
        signedTransaction = await signTransaction(transaction);
      }

      // Send the transaction
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm the transaction
      await connection.confirmTransaction(txid, 'processed');

      toast({
        title: 'Swap Successful!',
        description: `Transaction: ${txid}`,
      });

      return txid;
    } catch (error) {
      console.error('Error executing swap:', error);
      toast({
        title: 'Swap Failed',
        description: 'Failed to execute swap. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  return {
    getQuote,
    executeSwap,
    quote,
    loading,
  };
};