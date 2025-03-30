import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { bridgeService } from '../services/api';

const CrossChainBridge = () => {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState({
    sourceChain: '',
    targetChain: '',
    amount: '',
    asset: ''
  });
  const [txStatus, setTxStatus] = useState(null);

  useEffect(() => {
    const fetchConnectors = async () => {
      try {
        const response = await bridgeService.getConnectors();
        setConnectors(response.connectors);
        setLoading(false);
      } catch (err) {
        setError('Failed to load blockchain connectors');
        setLoading(false);
      }
    };

    fetchConnectors();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const intent = {
        sourceChain: transaction.sourceChain,
        targetChain: transaction.targetChain,
        amount: parseFloat(transaction.amount),
        asset: transaction.asset
      };

      const result = await bridgeService.executeTransaction(intent);
      
      // Subscribe to real-time transaction updates
      bridgeService.subscribeToTransactionUpdates(result.txId, (status) => {
        setTxStatus(status);
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to execute transaction');
      setLoading(false);
    }
  };

  if (loading && !txStatus) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Cross-Chain Bridge</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Source Chain</InputLabel>
              <Select
                name="sourceChain"
                value={transaction.sourceChain}
                onChange={handleInputChange}
              >
                {connectors.map((chain) => (
                  <MenuItem key={chain} value={chain}>{chain}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Target Chain</InputLabel>
              <Select
                name="targetChain"
                value={transaction.targetChain}
                onChange={handleInputChange}
              >
                {connectors.map((chain) => (
                  <MenuItem key={chain} value={chain}>{chain}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="amount"
              label="Amount"
              type="number"
              value={transaction.amount}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="asset"
              label="Asset"
              value={transaction.asset}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !transaction.sourceChain || !transaction.targetChain || !transaction.amount || !transaction.asset}
            >
              Execute Transaction
            </Button>
          </Grid>

          {txStatus && (
            <Grid item xs={12}>
              <Alert severity={txStatus.status === 'completed' ? 'success' : txStatus.status === 'failed' ? 'error' : 'info'}>
                Transaction Status: {txStatus.status}
                {txStatus.message && <Typography variant="body2">{txStatus.message}</Typography>}
              </Alert>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CrossChainBridge;