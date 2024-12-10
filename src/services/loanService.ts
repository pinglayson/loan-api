import { LoanApplication } from '../models/loan';
import { calculateMonthlyPayment } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';

export class LoanService {
  private loans: LoanApplication[] = [];

  createLoan(data: Omit<LoanApplication, 'id' | 'monthlyPayment' | 'createdAt'>): LoanApplication {
    const loanTerm = data.loanType === 'car' ? 5 : 3;
    const monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, loanTerm);

    const newLoan: LoanApplication = {
      ...data,
      id: uuidv4(),
      monthlyPayment,
      createdAt: new Date(),
    };

    this.loans.push(newLoan);
    return newLoan;
  }

  getAllLoans(): LoanApplication[] {
    return this.loans;
  }

  getLoanById(id: string): LoanApplication | undefined {
    return this.loans.find((loan) => loan.id === id);
  }

  updateLoan(id: string, data: Omit<LoanApplication, 'id' | 'monthlyPayment' | 'createdAt'>): LoanApplication | undefined {
    const loanIndex = this.loans.findIndex((loan) => loan.id === id);
    if (loanIndex === -1) return undefined;

    const loanTerm = data.loanType === 'car' ? 5 : 3;
    const monthlyPayment = calculateMonthlyPayment(data.loanAmount, data.interestRate, loanTerm);

    const updatedLoan: LoanApplication = {
      ...data,
      id,
      monthlyPayment,
      createdAt: this.loans[loanIndex].createdAt,
    };

    this.loans[loanIndex] = updatedLoan;
    return updatedLoan;
  }

  deleteLoan(id: string): boolean {
    const initialLength = this.loans.length;
    this.loans = this.loans.filter((loan) => loan.id !== id);
    return this.loans.length < initialLength;
  }
}