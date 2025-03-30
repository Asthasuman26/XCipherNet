import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Grid, Alert, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { usePrivacy } from '../contexts/PrivacyContext';
import { useWeb3 } from '../contexts/Web3Context';

const PaymentProcessor = () => {
  const { processPrivatePayment, privacyMode, setPrivacyMode } = usePrivacy();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [batchPayment, setBatchPayment] = useState({
    paymentDate: '',
    description: '',
    amount: '',
    employeeAddress: '',
    currency: 'USDC'
  });

  const handleProcessPayment = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await processPrivatePayment(
        batchPayment.employeeAddress,
        batchPayment.amount,
        batchPayment.currency
      );
      setSuccess(true);
    } catch (err) {
      setError('Failed to process private payment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Process Salary Payments</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Payment batch processed successfully!</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Privacy Protocol</InputLabel>
              <Select
                value={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.value)}
                label="Privacy Protocol"
              >
                <MenuItem value="zcash">Zcash Shielded</MenuItem>
                <MenuItem value="near">NEAR Private</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Employee Address"
              value={batchPayment.employeeAddress}
              onChange={(e) => setBatchPayment({ ...batchPayment, employeeAddress: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={batchPayment.amount}
              onChange={(e) => setBatchPayment({ ...batchPayment, amount: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={batchPayment.currency}
                onChange={(e) => setBatchPayment({ ...batchPayment, currency: e.target.value })}
                label="Currency"
              >
                <MenuItem value="ZEC">Zcash (ZEC)</MenuItem>
                <MenuItem value="NEAR">NEAR Protocol</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Payment Date"
              value={batchPayment.paymentDate}
              onChange={(e) => setBatchPayment({ ...batchPayment, paymentDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Payment Description"
              value={batchPayment.description}
              onChange={(e) => setBatchPayment({ ...batchPayment, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleProcessPayment}
              disabled={loading || !batchPayment.paymentDate}
            >
              {loading ? <CircularProgress size={24} /> : 'Process Salary Payments'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;