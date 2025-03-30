/**
 * Bridge API Routes
 * Handles API endpoints for cross-chain transactions
 */

const express = require('express');
const router = express.Router();
const { crossChainBridge } = require('../../index');

/**
 * POST /api/bridge/execute
 * Execute a cross-chain transaction
 */
router.post('/execute', async (req, res) => {
  try {
    const { intent, zkParams } = req.body;
    
    if (!intent) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing transaction intent' 
      });
    }
    
    const result = await crossChainBridge.executeIntentTransaction(
      intent,
      zkParams || {}
    );
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bridge/status/:txId
 * Get the status of a cross-chain transaction
 */
router.get('/status/:txId', (req, res) => {
  try {
    const { txId } = req.params;
    
    if (!txId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing transaction ID' 
      });
    }
    
    const status = crossChainBridge.getTransactionStatus(txId);
    
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/bridge/connectors
 * Get all available blockchain connectors
 */
router.get('/connectors', (req, res) => {
  try {
    const connectors = Array.from(crossChainBridge.connectors.keys());
    
    res.json({ 
      success: true, 
      connectors 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;