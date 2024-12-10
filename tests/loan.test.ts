import request from 'supertest';
import app from '../src/app';

describe('Loan Application API', () => {
  let loanId: string;

  const newLoan = {
    name: 'Alice Smith',
    loanAmount: 20000,
    loanType: 'car',
    income: 75000,
    interestRate: 4.5,
  };

  const updatedLoan = {
    name: 'Alice Johnson',
    loanAmount: 25000,
    loanType: 'personal',
    income: 80000,
    interestRate: 5,
  };

  it('POST /api/loans - should create a new loan', async () => {
    const res = await request(app).post('/api/loans').send(newLoan);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Loan created successfully');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('monthlyPayment');
    loanId = res.body.data.id;
  });

  it('GET /api/loans - should retrieve all loans', async () => {
    const res = await request(app).get('/api/loans');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Loans retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/loans/:id - should retrieve a loan by ID', async () => {
    const res = await request(app).get(`/api/loans/${loanId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Loan retrieved successfully');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', loanId);
  });

  it('PUT /api/loans/:id - should update a loan', async () => {
    const res = await request(app).put(`/api/loans/${loanId}`).send(updatedLoan);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Loan updated successfully');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id', loanId);
  });

  it('DELETE /api/loans/:id - should delete a loan', async () => {
    const res = await request(app).delete(`/api/loans/${loanId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('message', 'Loan deleted successfully');
  });

  it('GET /api/loans/:id - should return 404 for deleted loan', async () => {
    const res = await request(app).get(`/api/loans/${loanId}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe('Loan Validation', () => {
    const validLoan = {
      name: 'Test User',
      loanAmount: 20000,
      loanType: 'car',
      income: 75000,
      interestRate: 4.5,
    };
  
    describe('Name Validation', () => {
      it('should reject empty name', async () => {
        const invalidLoan = { ...validLoan, name: '' };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'name',
          message: 'Name cannot be empty'
        });
      });
  
      it('should reject non-string name', async () => {
        const invalidLoan = { ...validLoan, name: 123 };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'name',
          message: 'Name must be a string'
        });
      });
    });
  
    describe('Loan Amount Validation', () => {
      it('should reject negative loan amount', async () => {
        const invalidLoan = { ...validLoan, loanAmount: -1000 };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'loanAmount',
          message: 'Loan amount must be greater than 0'
        });
      });
  
      it('should reject non-numeric loan amount', async () => {
        const invalidLoan = { ...validLoan, loanAmount: 'invalid' };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'loanAmount',
          message: 'Loan amount must be a number'
        });
      });
    });
  
    describe('Loan Type Validation', () => {
      it('should reject invalid loan type', async () => {
        const invalidLoan = { ...validLoan, loanType: 'invalid' };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'loanType',
          message: 'Loan type must be either car or personal'
        });
      });
    });
  
    describe('Income Validation', () => {
      it('should reject negative income', async () => {
        const invalidLoan = { ...validLoan, income: -50000 };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'income',
          message: 'Income must be greater than 0'
        });
      });
  
      it('should reject non-numeric income', async () => {
        const invalidLoan = { ...validLoan, income: 'invalid' };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'income',
          message: 'Income must be a number'
        });
      });
    });
  
    describe('Interest Rate Validation', () => {
      it('should reject negative interest rate', async () => {
        const invalidLoan = { ...validLoan, interestRate: -1 };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'interestRate',
          message: 'Interest rate must be between 0 and 100'
        });
      });
  
      it('should reject interest rate above 100', async () => {
        const invalidLoan = { ...validLoan, interestRate: 101 };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors[0]).toMatchObject({
          field: 'interestRate',
          message: 'Interest rate must be between 0 and 100'
        });
      });
    });
  
    describe('Multiple Validation Errors', () => {
      it('should return all validation errors', async () => {
        const invalidLoan = {
          name: '',
          loanAmount: -1000,
          loanType: 'invalid',
          income: -50000,
          interestRate: 101
        };
        const res = await request(app).post('/api/loans').send(invalidLoan);
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors.length).toBeGreaterThan(1);
      });
    });
  });