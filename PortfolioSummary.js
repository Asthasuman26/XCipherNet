import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { portfolioService } from '../services/api';

const PortfolioSummary = ({ userId }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePortfolioUpdate = useCallback((updatedPortfolio) => {
    setPortfolio(updatedPortfolio);
  }, []);

  useEffect(() => {
    let unsubscribe;
    const initializePortfolio = async () => {
      try {
        const response = await portfolioService.createPortfolio(userId);
        const portfolioData = await portfolioService.getPortfolioSummary(response.portfolioId);
        setPortfolio(portfolioData.summary);
        setLoading(false);

        // Subscribe to real-time updates
        unsubscribe = portfolioService.subscribeToUpdates(response.portfolioId, handlePortfolioUpdate);
      } catch (err) {
        setError('Failed to load portfolio data');
        setLoading(false);
      }
    };

    initializePortfolio();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, handlePortfolioUpdate]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Portfolio Summary</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">Total Assets</Typography>
            <Typography variant="h4">{portfolio?.totalAssets || 0}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">Total Value</Typography>
            <Typography variant="h4">${portfolio?.totalValue?.toFixed(2) || '0.00'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">Performance</Typography>
            <Typography variant="h4" color={portfolio?.performance >= 0 ? 'success.main' : 'error.main'}>
              {portfolio?.performance?.toFixed(2)}%
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;