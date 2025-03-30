import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import EmployeeManagement from '../components/EmployeeManagement';

function Employees() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>Employee Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <EmployeeManagement />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Employees;