/**
 * Swap API Routes
 * Handles API endpoints for shielded token swaps
 */

const express = require('express');
const router = express.Router();
const { swapEngine } = require('../../index');

/**
 * GET /api/swap/pools
 * Get all available liquidity pools
 */
router.get('/pools', (req, res) => {
  try {
    const pools = Array.from(swapEngine.pools.entries()).map(([id, pool]) => ({
      id,
      tokenA: pool.tokenA,
      tokenB: pool.tokenB,
      reserveA: pool.reserveA,
      reserveB: pool.reserveB
    }));
    
    res.json({ success: true, pools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/swap/execute
 * Execute a shielded token swap
 */
router.post('/execute', async (req, res) => {
  try {
    const { fromToken, toToken, amount, zkParams } = req.body;
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    const result = await swapEngine.executeShieldedSwap(
      fromToken,
      toToken,
      parseFloat(amount),
      zkParams || {}
    );
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/swap/quote
 * Get a quote for a potential swap
 */
router.post('/quote', (req, res) => {
  try {
    const { fromToken, toToken, amount } = req.body;
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters' 
      });
    }
    
    // Calculate the expected output amount
    // This is a simplified version of what would happen in executeShieldedSwap
    const poolId = swapEngine._getPoolId(fromToken, toToken);
    
    if (!swapEngine.pools.has(poolId)) {
      return res.status(404).json({ 
        success: false, 
        error: `No liquidity pool exists for ${fromToken}-${toToken}` 
      });
    }
    
    const pool = swapEngine.pools.get(poolId);
    let inputAmount, outputAmount, inputReserve, outputReserve;
    
    // Determine input and output tokens and reserves
    if (fromToken === pool.tokenA) {
      inputAmount = parseFloat(amount);
      inputReserve = pool.reserveA;
      outputReserve = pool.reserveB;
    } else {
      inputAmount = parseFloat(amount);
      inputReserve = pool.reserveB;
      outputReserve = pool.reserveA;
    }
    
    // Calculate output amount using constant product formula (x * y = k)
    const inputAmountWithFee = inputAmount * (1 - swapEngine.feeRate);
    outputAmount = (outputReserve * inputAmountWithFee) / (inputReserve + inputAmountWithFee);
    
    res.json({
      success: true,
      quote: {
        fromToken,
        toToken,
        inputAmount,
        outputAmount,
        exchangeRate: outputAmount / inputAmount,
        fee: inputAmount * swapEngine.feeRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;