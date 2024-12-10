import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { RequestHandler } from 'express';
import { LoanService } from '../services/loanService';
import { LoanRequestBody } from '../middleware/validation';

const loanService = new LoanService();

export const getAllLoans: RequestHandler = asyncHandler(async (req, res) => {
  const response = await loanService.getAllLoans();
  res.json(response);
});

export const getLoanById: RequestHandler = asyncHandler(async (req, res) => {
  const response = await loanService.getLoanById(req.params.id);
  if (response.status === 'error') {
    throw createHttpError(404, response.message);
  }
  res.json(response);
});

export const createLoan: RequestHandler = asyncHandler(async (req, res) => {
  const loanData: LoanRequestBody = req.body;
  const response = await loanService.createLoan(loanData);
  res.status(201).json(response);
});

export const updateLoan: RequestHandler = asyncHandler(async (req, res) => {
  const loanData: LoanRequestBody = req.body;
  const response = await loanService.updateLoan(req.params.id, loanData);
  if (response.status === 'error') {
    throw createHttpError(404, response.message);
  }
  res.json(response);
});

export const deleteLoan: RequestHandler = asyncHandler(async (req, res) => {
  const response = await loanService.deleteLoan(req.params.id);
  if (response.status === 'error') {
    throw createHttpError(404, response.message);
  }
  res.status(200).json(response);
});