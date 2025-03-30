import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Alert } from '@mui/material';
import { usePrivacy } from '../contexts/PrivacyContext';

const EmployeeManagement = () => {
  const { paymentService } = usePrivacy();
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    salary: '',
    walletAddress: '',
    email: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeList = await paymentService.getEmployees();
        setEmployees(employeeList);
      } catch (err) {
        setError('Failed to fetch employees: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (paymentService) {
      fetchEmployees();
    }
  }, [paymentService]);

  const handleAddEmployee = async () => {
    try {
      const employee = await paymentService.addEmployee(newEmployee);
      setEmployees([...employees, employee]);
      setNewEmployee({
        name: '',
        position: '',
        salary: '',
        walletAddress: '',
        email: ''
      });
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      setError('Failed to add employee: ' + err.message);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="h6">Employee Management</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                Add Employee
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell align="right">Salary</TableCell>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell align="right">${employee.salary.toLocaleString()}</TableCell>
                    <TableCell>{employee.walletAddress}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Salary"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Wallet Address"
                value={newEmployee.walletAddress}
                onChange={(e) => setNewEmployee({ ...newEmployee, walletAddress: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeManagement;