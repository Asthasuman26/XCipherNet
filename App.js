import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3Provider } from './contexts/Web3Context';
import { PrivacyProvider } from './contexts/PrivacyContext';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Payments from './pages/Payments';
import Navigation from './components/Navigation';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0d14',
      paper: '#141824'
    },
    primary: {
      main: '#00ff9d',
      dark: '#00cc7d',
      light: '#33ffb1',
      contrastText: '#141824'
    },
    secondary: {
      main: '#7000ff',
      dark: '#5a00cc',
      light: '#8c33ff',
      contrastText: '#ffffff'
    },
    info: {
      main: '#00f0ff',
      dark: '#00bfcc',
      light: '#33f4ff',
      contrastText: '#141824'
    },
    warning: {
      main: '#ff7b00',
      dark: '#cc6200',
      light: '#ff9533',
      contrastText: '#141824'
    },
    success: {
      main: '#ff00f5',
      dark: '#cc00c4',
      light: '#ff33f7',
      contrastText: '#141824'
    },
    text: {
      primary: '#00f0ff',
      secondary: '#ff7b00',
      disabled: '#666666'
    },
    divider: 'rgba(0, 240, 255, 0.12)'
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(145deg, #0a0d14 0%, #141824 100%)',
          minHeight: '100vh'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Web3Provider>
            <PrivacyProvider>
              <Navigation />
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/payments" element={<Payments />} />
                </Routes>
              </Box>
            </PrivacyProvider>
          </Web3Provider>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
