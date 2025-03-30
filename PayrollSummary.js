import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { usePrivacy } from '../contexts/PrivacyContext';

const PayrollSummary = () => {
  const { getEncryptedPaymentHistory, privacyMode } = usePrivacy();
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const encryptedHistory = await getEncryptedPaymentHistory();
        const currentDate = new Date();
        const nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

        // Process encrypted payment data while maintaining privacy
        const processedData = {
          totalEmployees: new Set(encryptedHistory.map(p => p.employeeAddress)).size,
          totalPayroll: encryptedHistory
            .filter(p => p.status === 'completed')
            .reduce((total, p) => total + Number(p.amount), 0),
          nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
          recentPayments: encryptedHistory
            .filter(p => p.status === 'completed')
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
            .map(p => ({
              id: p.id,
              employeeAddress: p.employeeAddress,
              amount: p.amount,
              date: new Date(p.timestamp).toISOString().split('T')[0],
              status: p.status
            }))
        };

        setPayrollData(processedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load encrypted payroll data');
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [getEncryptedPaymentHistory]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>XCipherNet Payment Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="textSecondary">Total Employees</Typography>
                <Typography variant="h4">{payrollData.totalEmployees}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="textSecondary">Total Monthly Payments</Typography>
                <Typography variant="h4">{payrollData.totalPayroll.toLocaleString()} ZEC</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="textSecondary">Next Payment Date</Typography>
                <Typography variant="h4">{payrollData.nextPaymentDate}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Recent Encrypted Transactions</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee Name</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payrollData.recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.employeeName}</TableCell>
                      <TableCell align="right">{payment.amount.toLocaleString()} ZEC</TableCell>
                      <TableCell align="right">{payment.date}</TableCell>
                      <TableCell align="right">{payment.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PayrollSummary;