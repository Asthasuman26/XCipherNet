/**
 * Portfolio API Routes
 * Handles API endpoints for private portfolio management
 */

const express = require('express');
const router = express.Router();
const { portfolioManager } = require('../../index');

/**
 * POST /api/portfolio/create
 * Create a new private portfolio
 */
router.post('/create', (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    const portfolioId = portfolioManager.createPortfolio(userId);
    
    res.json({ 
      success: true, 
      portfolioId 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/portfolio/add-asset
 * Add an asset to a portfolio
 */
router.post('/add-asset', async (req, res) => {
  try {
    const { portfolioId, asset, zkParams } = req.body;
    
    if (!portfolioId || !asset) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    const result = await portfolioManager.addAsset(
      portfolioId,
      asset,
      zkParams || {}
    );
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/portfolio/:portfolioId
 * Get a portfolio summary
 */
router.get('/:portfolioId', (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    if (!portfolioId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing portfolio ID' 
      });
    }
    
    const summary = portfolioManager.getPortfolioSummary(portfolioId);
    
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;