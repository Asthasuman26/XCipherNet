import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import WalletConnect from './WalletConnect';

function Navigation() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          XCipherNet
        </Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/employees">Employees</Button>
        <Button color="inherit" component={Link} to="/payments">Payments</Button>
        <Box sx={{ ml: 2 }}>
          <WalletConnect />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;