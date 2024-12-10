import { LoanApplication } from '../models/loan';
import { calculateMonthlyPayment } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';

interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export class LoanService {
  private loans: LoanApplication[] = [];

  createLoan(data: Omit<LoanApplication, 'id' | 'monthlyPayment' | 'createdAt'>): ApiResponse<LoanApplication> {
    const loanTerm = data.loanType === 'car' ? 5 : 3;
    const monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, loanTerm);

    const newLoan: LoanApplication = {
      ...data,
      id: uuidv4(),
      monthlyPayment,
      createdAt: new Date(),
    };

    this.loans.push(newLoan);
    return {
      status: 'success',
      message: 'Loan created successfully',
      data: newLoan,
    };
  }

  getAllLoans(): ApiResponse<LoanApplication[]> {
    return {
      status: 'success',
      message: 'Loans retrieved successfully',
      data: this.loans,
    };
  }

  getLoanById(id: string): ApiResponse<LoanApplication | undefined> {
    const loan = this.loans.find((loan) => loan.id === id);
    if (!loan) {
      return {
        status: 'error',
        message: 'Loan not found',
      };
    }
    return {
      status: 'success',
      message: 'Loan retrieved successfully',
      data: loan,
    };
  }

  updateLoan(id: string, data: Omit<LoanApplication, 'id' | 'monthlyPayment' | 'createdAt'>): ApiResponse<LoanApplication | undefined> {
    const loanIndex = this.loans.findIndex((loan) => loan.id === id);
    if (loanIndex === -1) {
      return {
        status: 'error',
        message: 'Loan not found',
      };
    }

    const loanTerm = data.loanType === 'car' ? 5 : 3;
    const monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, loanTerm);

    const updatedLoan: LoanApplication = {
      ...data,
      id,
      monthlyPayment,
      createdAt: this.loans[loanIndex].createdAt,
    };

    this.loans[loanIndex] = updatedLoan;
    return {
      status: 'success',
      message: 'Loan updated successfully',
      data: updatedLoan,
    };
  }

  deleteLoan(id: string): ApiResponse<null> {
    const loanIndex = this.loans.findIndex((loan) => loan.id === id);
    if (loanIndex === -1) {
      return {
        status: 'error',
        message: 'Loan not found',
      };
    }

    this.loans.splice(loanIndex, 1);
    return {
      status: 'success',
      message: 'Loan deleted successfully',
      data: null,
    };
  }
}