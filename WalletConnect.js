import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const WalletConnect = () => {
  const { account, isConnecting, error, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (error) {
    const isMetaMaskError = error.includes('MetaMask is not installed');
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isMetaMaskError ? (
          <>
            <Typography color="error" variant="body2">
              MetaMask is not installed.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              Install MetaMask
            </Button>
          </>
        ) : (
          <>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={connectWallet}
              size="small"
            >
              Try Again
            </Button>
          </>
        )}
      </Box>
    );
  }

  if (isConnecting) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
        <Typography variant="body2">Connecting...</Typography>
      </Box>
    );
  }

  if (account) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">{formatAddress(account)}</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={disconnectWallet}
          size="small"
        >
          Disconnect
        </Button>
      </Box>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={connectWallet}
      startIcon={<AccountBalanceWalletIcon />}
    >
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;