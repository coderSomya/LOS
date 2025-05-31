
export interface User {
  id: string;
  username: string;
  userType: UserType;
  pincode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  custId: string;
  name: string;
  phone: string;
  pincode: string;
  aadharNumber?: string;
  panNumber?: string;
  kycVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  applications?: Application[];
}

export interface Application {
  id: string;
  leadId: string;
  customer: Customer;
  customerId: string;
  tempAppId?: string;
  appId?: string;
  pincode: string;
  loanType: LoanType;
  status: AppStatus;
  formData?: any;
  createdAt: Date;
  updatedAt: Date;
  activities?: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  application: Application;
  applicationId: string;
  actionType: ActionType;
  comment: string;
  performedBy: string;
  performedAt: Date;
}

export interface LoanFormData {
  fullName: string;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  leadSource: string;
}

export interface DataState {
  customers: Customer[];
  applications: Application[];
  loading: boolean;
  error: string | null;
}

export enum UserType {
  SALES_MAKER = 'SALES_MAKER',
  SALES_CHECKER = 'SALES_CHECKER'
}

export enum LoanType {
  GOLD_LOAN = 'GOLD_LOAN',
  HOME_LOAN = 'HOME_LOAN',
  BUSINESS_LOAN = 'BUSINESS_LOAN',
  PERSONAL_LOAN = 'PERSONAL_LOAN'
}

export enum AppStatus {
  DRAFT = 'DRAFT',
  FORM_SUBMITTED = 'FORM_SUBMITTED',
  LOAN_APPROVED = 'LOAN_APPROVED',
  LOAN_REJECTED = 'LOAN_REJECTED'
}

export enum ActionType {
  CREATED = 'CREATED',
  SAVED = 'SAVED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  KYC_VERIFIED = 'KYC_VERIFIED'
}
