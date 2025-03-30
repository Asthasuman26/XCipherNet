const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Required environment variables
const requiredEnvVars = [
  'ZCASH_RPC_URL',
  'ZCASH_RPC_USER',
  'ZCASH_RPC_PASSWORD',
  'ZCASH_NETWORK',
  'MEMO_KEY'
];

// Validate required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Export environment configuration
module.exports = {
  zcash: {
    rpcUrl: process.env.ZCASH_RPC_URL,
    rpcUser: process.env.ZCASH_RPC_USER,
    rpcPassword: process.env.ZCASH_RPC_PASSWORD,
    network: process.env.ZCASH_NETWORK
  },
  memoKey: process.env.MEMO_KEY,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  description: 'Privacy-focused DeFi platform for secure payroll using Zcash/NEAR with AI optimization and smart fee reduction.'
};