import React, { createContext, useContext, useState } from 'react';
import { useWeb3 } from './Web3Context';
import PaymentService from '../services/PaymentService';

const PrivacyContext = createContext();

export function usePrivacy() {
  return useContext(PrivacyContext);
}

export function PrivacyProvider({ children }) {
  const { web3, account } = useWeb3();
  const [privacyMode, setPrivacyMode] = useState('zcash');
  const [shieldedBalance, setShieldedBalance] = useState(0);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [paymentService, setPaymentService] = useState(null);

  // Initialize privacy protocols
  const initializePrivacyProtocol = async () => {
    try {
      const config = {
        zcash: {
          rpcUrl: process.env.REACT_APP_ZCASH_RPC_URL,
          rpcUser: process.env.REACT_APP_ZCASH_RPC_USER,
          rpcPassword: process.env.REACT_APP_ZCASH_RPC_PASSWORD,
          network: process.env.REACT_APP_ZCASH_NETWORK
        },
        network: {
          shieldedAddress: process.env.REACT_APP_SHIELDED_ADDRESS
        }
      };

      const service = new PaymentService(config);
      await service.initialize();
      setPaymentService(service);

      // Update initial shielded balance
      if (account) {
        const balance = await service.getShieldedBalance(account);
        setShieldedBalance(balance);
      }
    } catch (error) {
      console.error('Failed to initialize privacy protocol:', error);
      throw error;
    }
  };

  // Process private salary payment
  const processPrivatePayment = async (employeeAddress, amount, currency) => {
    let transactionId;
    // Define transaction outside try/catch so it's accessible in both blocks
    const transaction = {
      id: Date.now(),
      employeeAddress,
      amount,
      currency,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    try {
      if (!paymentService) {
        throw new Error('Payment service not initialized');
      }

      setPendingTransactions(prev => [...prev, transaction]);

      const result = await paymentService.processPrivatePayment({
        employeeAddress,
        amount,
        currency,
        description: `Salary payment - ${new Date().toLocaleDateString()}`,
        paymentDate: new Date().toISOString()
      });

      // Update transaction status
      setPendingTransactions(prev =>
        prev.map(tx =>
          tx.id === transaction.id
            ? { ...tx, status: result.status, transactionId: result.transactionId }
            : tx
        )
      );

      // Update shielded balance
      if (account) {
        const balance = await paymentService.getShieldedBalance(account);
        setShieldedBalance(balance);
      }

      return result;
    } catch (error) {
      console.error('Private payment failed:', error);
      // Update transaction status to failed
      setPendingTransactions(prev =>
        prev.map(tx =>
          tx.id === transaction.id
            ? { ...tx, status: 'failed', error: error.message }
            : tx
        )
      );
      throw error;
    }
  };

  // Get encrypted payment history
  const getEncryptedPaymentHistory = async () => {
    try {
      // Implement fetching encrypted payment history
      // This would be integrated with actual blockchain storage
      return [];
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      return [];
    }
  };

  const value = {
    privacyMode,
    setPrivacyMode,
    shieldedBalance,
    pendingTransactions,
    processPrivatePayment,
    getEncryptedPaymentHistory,
    initializePrivacyProtocol
  };

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  );
}