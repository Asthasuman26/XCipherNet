// Mock API responses for development
const mockData = {
  payments: [],
  employees: [
    { id: 1, name: 'John Doe', position: 'Software Engineer', salary: 5000, walletAddress: 'zs1...x8k2', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', salary: 6000, walletAddress: 'zs2...j9m3', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', position: 'Designer', salary: 4500, walletAddress: 'zs3...h5n4', email: 'bob@example.com' },
  ],
  balances: {
    'default': 1000
  }
};

export const mockApi = {
  processPayment: async (paymentDetails) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = {
          id: Date.now(),
          ...paymentDetails,
          status: 'completed',
          timestamp: new Date().toISOString()
        };
        mockData.payments.push(payment);
        resolve(payment);
      }, 1000);
    });
  },

  getShieldedBalance: async (address) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          balance: mockData.balances[address] || mockData.balances.default
        });
      }, 500);
    });
  },

  getEmployees: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.employees);
      }, 500);
    });
  },

  addEmployee: async (employee) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEmployee = {
          id: mockData.employees.length + 1,
          ...employee
        };
        mockData.employees.push(newEmployee);
        resolve(newEmployee);
      }, 500);
    });
  }
};