import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3001/api';
const WEBSOCKET_URL = 'http://localhost:3001';

// Initialize WebSocket connection
const socket = io(WEBSOCKET_URL);

// WebSocket event handlers
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const portfolioService = {
  createPortfolio: (userId) => api.post('/portfolio/create', { userId }),
  addAsset: (portfolioId, asset, zkParams) => api.post('/portfolio/add-asset', { portfolioId, asset, zkParams }),
  getPortfolioSummary: (portfolioId) => api.get(`/portfolio/${portfolioId}`),
  subscribeToUpdates: (portfolioId, callback) => {
    socket.emit('subscribe:portfolio', portfolioId);
    socket.on(`portfolio:${portfolioId}:update`, callback);
    return () => {
      socket.off(`portfolio:${portfolioId}:update`, callback);
      socket.emit('unsubscribe:portfolio', portfolioId);
    };
  }
};

export const bridgeService = {
  executeTransaction: (intent, zkParams) => api.post('/bridge/execute', { intent, zkParams }),
  getTransactionStatus: (txId) => api.get(`/bridge/status/${txId}`),
  getConnectors: () => api.get('/bridge/connectors'),
  subscribeToTransactionUpdates: (txId, callback) => {
    socket.emit('subscribe:transaction', txId);
    socket.on(`transaction:${txId}:update`, callback);
    return () => {
      socket.off(`transaction:${txId}:update`, callback);
      socket.emit('unsubscribe:transaction', txId);
    };
  }
};

export const aiService = {
  setPreferences: (userId, preferences) => api.post('/ai/preferences', { userId, preferences }),
  getRecommendations: (userId, marketData, portfolioData) => 
    api.post('/ai/recommendations', { userId, marketData, portfolioData }),
  getStrategies: () => api.get('/ai/strategies'),
};