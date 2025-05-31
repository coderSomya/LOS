export type User = {
  id: string;
  username: string;
  userType: UserType;
  pincode: string;
};

export enum UserType {
  SALES_MAKER = "SALES_MAKER",
  SALES_CHECKER = "SALES_CHECKER"
}

export enum LoanType {
  GOLD_LOAN = "GOLD_LOAN",
  HOME_LOAN = "HOME_LOAN",
  BUSINESS_LOAN = "BUSINESS_LOAN",
  PERSONAL_LOAN = "PERSONAL_LOAN"
}

export enum CustomerType {
  ETC = "ETC", // Existing To Company
  NTC = "NTC"  // New To Company
}

export enum AppStatus {
  DRAFT = "DRAFT",
  FORM_SUBMITTED = "FORM_SUBMITTED",
  LOAN_APPROVED = "LOAN_APPROVED",
  LOAN_REJECTED = "LOAN_REJECTED"
}

export enum ActionType {
  CREATED = "CREATED",
  SAVED = "SAVED",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  KYC_VERIFIED = "KYC_VERIFIED"
}

export type Customer = {
  id: string;
  custId: string;
  name: string;
  phone: string;
  pincode: string;
  aadharNumber?: string;
  panNumber?: string;
  kycVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Application = {
  id: string;
  leadId: string;
  customerId: string;
  tempAppId?: string;
  appId?: string;
  pincode: string;
  loanType: LoanType;
  status: AppStatus;
  formData?: any;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
};

export type ActivityLog = {
  id: string;
  applicationId: string;
  actionType: ActionType;
  comment: string;
  performedBy: string;
  performedAt: string;
};

export type KycFormData = {
  name: string;
  phone: string;
  pincode: string;
  aadharNumber?: string;
  panNumber?: string;
};

export type LoanFormData = {
  loanAmount: number;
  tenure: number;
  purpose: string;
  monthlyIncome: number;
  employment: string;
  [key: string]: any;
};

export type LoanFormData = {
  fullName: string;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  existingLoans: boolean;
  leadSource: string;
};

export type KycFormData = {
  name: string;
  phone: string;
  pincode: string;
  aadharNumber: string;
  panNumber: string;
};