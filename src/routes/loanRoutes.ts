import express, { Router } from 'express';
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
} from '../controllers/loanController';
import { 
  validateLoanApplication, 
  loanValidationRules,
} from '../middleware/validation';

const router: Router = express.Router();

router.get('/loans', getAllLoans);
router.get('/loans/:id', getLoanById);
router.post('/loans', 
  loanValidationRules,
  validateLoanApplication,
  createLoan
);
router.put('/loans/:id',
  loanValidationRules,
  validateLoanApplication,
  updateLoan
);
router.delete('/loans/:id', deleteLoan);

export default router;