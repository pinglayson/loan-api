import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { LoanType } from '../models/loan';

export interface LoanRequestBody {
  name: string;
  loanAmount: number;
  loanType: LoanType;
  income: number;
  interestRate: number;
}

export const loanValidationRules: ValidationChain[] = [
  body('name')
    .exists()
    .withMessage('Name is required')
    .custom((value) => {
      if (typeof value !== 'string') {
        throw new Error('Name must be a string');
      }
      return true;
    })
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty'),

  body('loanAmount')
    .notEmpty()
    .withMessage('Loan amount is required')
    .isNumeric()
    .withMessage('Loan amount must be a number')
    .custom((value) => value > 0)
    .withMessage('Loan amount must be greater than 0'),

  body('loanType')
    .notEmpty()
    .withMessage('Loan type is required')
    .isIn(['car', 'personal'])
    .withMessage('Loan type must be either car or personal'),

  body('income')
    .notEmpty()
    .withMessage('Income is required')
    .isNumeric()
    .withMessage('Income must be a number')
    .custom((value) => value > 0)
    .withMessage('Income must be greater than 0'),

  body('interestRate')
    .notEmpty()
    .withMessage('Interest rate is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100')
];

export const validateLoanApplication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : '',
        message: err.msg
      }))
    });
    return;
  }
  next();
};
