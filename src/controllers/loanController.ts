import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { RequestHandler } from 'express';
import { LoanService } from '../services/loanService';
import { LoanRequestBody } from '../middleware/validation';

const loanService = new LoanService();

export const getAllLoans: RequestHandler = asyncHandler(async (req, res) => {
  const loans = await loanService.getAllLoans();
  res.json(loans);
});

export const getLoanById: RequestHandler = asyncHandler(async (req, res) => {
  const loan = await loanService.getLoanById(req.params.id);
  if (!loan) {
    throw createHttpError(404, 'Loan not found');
  }
  res.json(loan);
});

export const createLoan: RequestHandler = asyncHandler(async (req, res) => {
  const loanData: LoanRequestBody = req.body;
  const newLoan = await loanService.createLoan(loanData);
  res.status(201).json(newLoan);
});

export const updateLoan: RequestHandler = asyncHandler(async (req, res) => {
  const loanData: LoanRequestBody = req.body;
  const updatedLoan = await loanService.updateLoan(req.params.id, loanData);
  if (!updatedLoan) {
    throw createHttpError(404, 'Loan not found');
  }
  res.json(updatedLoan);
});

export const deleteLoan: RequestHandler = asyncHandler(async (req, res) => {
  const deleted = await loanService.deleteLoan(req.params.id);
  if (!deleted) {
    throw createHttpError(404, 'Loan not found');
  }
  res.status(204).send();
});