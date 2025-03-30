const CryptoJS = require('crypto-js');

class PrivatePortfolioManager {
  constructor() {
    this.portfolios = new Map();
    this.initialized = false;
  }

  async initialize() {
    try {
      // Load initial portfolio data
      await this._loadPortfolioData();
      this.initialized = true;
      console.log('PrivatePortfolioManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PrivatePortfolioManager:', error);
      throw error;
    }
  }

  async _loadPortfolioData() {
    try {
      // Here we would typically load portfolio data from a secure storage
      // For now, we'll initialize with empty portfolios
      this.portfolios.clear();
      console.log('Portfolio data loaded successfully');
    } catch (error) {
      throw new Error(`Failed to load portfolio data: ${error.message}`);
    }
  }

  createPortfolio(userId) {
    const portfolioId = this._generatePortfolioId(userId);
    this.portfolios.set(portfolioId, {
      userId,
      assets: [],
      totalValue: 0,
      performance: 0,
      lastUpdated: Date.now()
    });
    return portfolioId;
  }

  async addAsset(portfolioId, asset, zkParams = {}) {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Encrypt sensitive asset data
    const encryptedAsset = this._encryptAssetData(asset);
    portfolio.assets.push(encryptedAsset);

    // Update portfolio metrics
    this._updatePortfolioMetrics(portfolio);
    return true;
  }

  getPortfolioSummary(portfolioId) {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return {
      totalAssets: portfolio.assets.length,
      totalValue: portfolio.totalValue,
      performance: portfolio.performance,
      lastUpdated: portfolio.lastUpdated
    };
  }

  _generatePortfolioId(userId) {
    return `${userId}-${Date.now()}`;
  }

  _encryptAssetData(asset) {
    const encryptionKey = process.env.MEMO_KEY || 'default-key';
    return {
      ...asset,
      value: CryptoJS.AES.encrypt(asset.value.toString(), encryptionKey).toString()
    };
  }

  _updatePortfolioMetrics(portfolio) {
    // Calculate total value and performance
    let totalValue = 0;
    portfolio.assets.forEach(asset => {
      const decryptedValue = this._decryptValue(asset.value);
      totalValue += parseFloat(decryptedValue);
    });

    portfolio.totalValue = totalValue;
    portfolio.lastUpdated = Date.now();
    
    // Simple performance calculation (can be enhanced)
    if (portfolio.assets.length > 1) {
      const previousValue = portfolio.totalValue;
      portfolio.performance = ((totalValue - previousValue) / previousValue) * 100;
    }
  }

  _decryptValue(encryptedValue) {
    const encryptionKey = process.env.MEMO_KEY || 'default-key';
    const bytes = CryptoJS.AES.decrypt(encryptedValue, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

module.exports = PrivatePortfolioManager;