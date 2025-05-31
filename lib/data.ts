"use client";

import { create } from "zustand";
import { 
  Customer, 
  Application, 
  ActivityLog, 
  LoanType,
  LoanFormData,
  KycFormData
} from "@/types";
import { useAuth } from "./use-auth";

interface DataState {
  // Customer methods
  addCustomer: (customerData: KycFormData) => Promise<Customer>;
  getCustomerById: (custId: string) => Promise<Customer | null>;
  getCustomerByPhone: (phone: string) => Promise<Customer | null>;
  updateCustomerKyc: (custId: string, verified: boolean, userId: string) => Promise<boolean>;

  // Application methods
  createApplication: (data: {
    customerId: string,
    pincode: string,
    loanType: LoanType,
    userId: string
  }) => Promise<Application>;
  getApplicationsByPincode: (pincode: string) => Promise<Application[]>;
  getApplicationById: (id: string) => Promise<Application | null>;
  getActivitiesByApplicationId: (appId: string) => Promise<ActivityLog[]>;
  saveApplicationForm: (
    appId: string,
    formData: LoanFormData,
    userId: string
  ) => Promise<Application | null>;
  submitApplicationForm: (
    appId: string,
    formData: LoanFormData,
    userId: string
  ) => Promise<Application | null>;
  approveApplication: (
    appId: string,
    userId: string,
    comment: string
  ) => Promise<Application | null>;
  rejectApplication: (
    appId: string,
    userId: string,
    comment: string
  ) => Promise<Application | null>;
}

export const useDataStore = create<DataState>()((set, get) => ({
  // Customer methods
  addCustomer: async (customerData) => {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData),
        });

        if (!response.ok) {
          throw new Error('Failed to create customer');
        }

        const customer = await response.json();

        return customer;
      },

  getCustomerById: async (custId: string) => {
    const response = await fetch(`/api/customers?custId=${custId}`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  getCustomerByPhone: async (phone: string) => {
    const response = await fetch(`/api/customers?phone=${phone}`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  updateCustomerKyc: async (custId: string, verified: boolean, userId: string) => {
    const response = await fetch(`/api/customers/${custId}/kyc`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified, userId }),
    });

    return response.ok;
  },

  // Application methods
  createApplication: async (data) => {
        const user = useAuth.getState().user;
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, userId: user?.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to create application');
        }

        const application = await response.json();

        return application;
      },

  getApplicationsByPincode: async (pincode) => {
        const response = await fetch(`/api/applications?pincode=${pincode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const applications = await response.json();

        return applications;
      },

  getApplicationById: async (id: string) => {
    const response = await fetch(`/api/applications/${id}`);

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  getActivitiesByApplicationId: async (appId: string) => {
    const response = await fetch(`/api/applications/${appId}/activities`);

    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }

    return response.json();
  },

  saveApplicationForm: async (appId: string, formData: LoanFormData, userId: string) => {
    const response = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save", formData, userId }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  submitApplicationForm: async (appId: string, formData: LoanFormData, userId: string) => {
    const response = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit", formData, userId }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  approveApplication: async (appId: string, userId: string, comment: string) => {
    const response = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve", userId, comment }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  rejectApplication: async (appId: string, userId: string, comment: string) => {
    const response = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", userId, comment }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },
}));