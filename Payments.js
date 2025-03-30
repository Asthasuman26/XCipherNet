import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import PayrollSummary from '../components/PayrollSummary';
import PaymentProcessor from '../components/PaymentProcessor';

function Payments() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Payment Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PayrollSummary />
        </Grid>
        
        <Grid item xs={12}>
          <PaymentProcessor />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Payments;