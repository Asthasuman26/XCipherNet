import { mockApi } from './mockApi';

class PaymentService {
  constructor(config) {
    this.config = config;
  }

  async initialize() {
    try {
      // Initialize connection with mock API for development
      console.log('PaymentService initialized with mock API');
    } catch (error) {
      console.error('Failed to initialize PaymentService:', error);
      throw error;
    }
  }

  async processPrivatePayment(paymentDetails) {
    try {
      const result = await mockApi.processPayment(paymentDetails);
      return result;
    } catch (error) {
      console.error('Private payment processing failed:', error);
      throw new Error(`Failed to process private payment: ${error.message}`);
    }
  }

  async getShieldedBalance(address) {
    try {
      const result = await mockApi.getShieldedBalance(address);
      return result.balance;
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      throw error;
    }
  }

  async getEmployees() {
    try {
      return await mockApi.getEmployees();
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      throw error;
    }
  }

  async addEmployee(employee) {
    try {
      return await mockApi.addEmployee(employee);
    } catch (error) {
      console.error('Failed to add employee:', error);
      throw error;
    }
  }
}

export default PaymentService;