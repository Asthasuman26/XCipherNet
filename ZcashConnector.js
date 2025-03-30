const axios = require('axios');
const CryptoJS = require('crypto-js');

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

class ZcashConnector {
  constructor(config) {
    this.rpcUrl = config.rpcUrl;
    this.rpcUser = config.rpcUser;
    this.rpcPassword = config.rpcPassword;
    this.network = config.network;
  }

  async initialize() {
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const networkInfo = await this._rpcCall('getnetworkinfo');
        console.log(`Connected to Zcash network: ${this.network} (attempt ${attempt})`);
        return networkInfo;
      } catch (error) {
        lastError = error;
        console.warn(`Zcash connection attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    throw new Error(`Failed to initialize Zcash connector after ${MAX_RETRIES} attempts: ${lastError.message}`);
  }

  async createShieldedTransaction(from, to, amount, memo) {
    try {
      const params = {
        from,
        to,
        amount: parseFloat(amount),
        memo: this._encryptMemo(memo)
      };

      const transaction = await this._rpcCall('z_sendmany', [from, [params]]);
      return transaction;
    } catch (error) {
      throw new Error(`Failed to create shielded transaction: ${error.message}`);
    }
  }

  async getShieldedBalance(address) {
    try {
      const balance = await this._rpcCall('z_getbalance', [address]);
      return balance;
    } catch (error) {
      throw new Error(`Failed to get shielded balance: ${error.message}`);
    }
  }

  async _rpcCall(method, params = []) {
    try {
      if (!this.rpcUrl || !this.rpcUser || !this.rpcPassword) {
        throw new Error('Invalid RPC configuration. Please check your environment variables.');
      }

      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params
      }, {
        auth: {
          username: this.rpcUser,
          password: this.rpcPassword
        },
        timeout: 5000 // 5 second timeout
      });

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Please ensure Zcash daemon is running.');
      } else if (error.code === 'ETIMEDOUT') {
        throw new Error('Connection timed out. Please check network connectivity.');
      } else if (error.response && error.response.status === 401) {
        throw new Error('Authentication failed. Please check RPC credentials.');
      }
      throw new Error(`RPC call failed: ${error.message}`);
    }
  }

  _encryptMemo(memo) {
    return CryptoJS.AES.encrypt(memo, process.env.MEMO_KEY || 'default-key').toString();
  }
}

module.exports = ZcashConnector;