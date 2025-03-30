import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, IconButton, Box, Chip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { usePrivacy } from '../contexts/PrivacyContext';
import { useWeb3 } from '../contexts/Web3Context';

function Dashboard() {
  const { account } = useWeb3();
  const { shieldedBalance, pendingTransactions, initializePrivacyProtocol } = usePrivacy();
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    initializePrivacyProtocol();
  }, [initializePrivacyProtocol]);

  const formatAddress = (address) => {
    if (!address) return 'Not Connected';
    return showAddress ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Wallet Information</Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="body1" component="span">
                  Address: {formatAddress(account)}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowAddress(!showAddress)}
                  sx={{ ml: 1 }}
                >
                  {showAddress ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
              <Typography variant="body1" gutterBottom>
                Shielded Balance: {shieldedBalance} ZEC
              </Typography>
              {pendingTransactions.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>Pending Transactions</Typography>
                  {pendingTransactions.map((tx) => (
                    <Chip
                      key={tx.id}
                      label={`${tx.amount} ${tx.currency} - ${tx.status}`}
                      color={tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'error' : 'warning'}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Links</Typography>
              <Typography variant="body1" paragraph>
                Welcome to XCipherNet! Use the navigation menu to:
              </Typography>
              <Typography variant="body2" component="ul">
                <li>Manage employees and their information</li>
                <li>Process salary payments</li>
                <li>View payment history and receipts</li>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;