export type LoanType = 'car' | 'personal';

export interface LoanApplication {
  id: string;
  name: string;
  loanAmount: number;
  loanType: LoanType;
  income: number;
  interestRate: number;
  monthlyPayment: number;
  createdAt: Date;
}