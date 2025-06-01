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
import { useAuth } from "./auth";

interface DataState {
  // Customer methods
  addCustomer: (customerData: KycFormData) => Promise<Customer>;
  getCustomerById: (custId: string) => Promise<Customer | null>;
  getCustomerByPhone: (phone: string) => Promise<Customer | null>;
  getCustomersByPincode: (pincode: string) => Promise<Customer[]>;
  updateCustomerKyc: (custId: string, verified: boolean, userId: string) => Promise<boolean>;

  // Application methods
  createApplication: (data: {
    customerId: string,
    pincode: string,
    loanType: LoanType,
    userId: string,
    leadId: string;
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
  addCustomer: async (customerData: KycFormData): Promise<Customer> => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }

      const customer = await response.json();
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  getCustomerById: async (custId: string): Promise<Customer | null> => {
  try {
    console.log("Fetching customer with ID:", custId);
    const response = await fetch(`/api/customers?custId=${encodeURIComponent(custId)}`);
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log("Customer not found (404)");
        return null;
      }
      throw new Error('Failed to fetch customer');
    }

    const data = await response.json();
    console.log("Customer data received:", data);
    return data;
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return null;
  }
},

  getCustomerByPhone: async (phone: string): Promise<Customer | null> => {
    try {
      const response = await fetch(`/api/customers?phone=${encodeURIComponent(phone)}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch customer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customer by phone:', error);
      return null;
    }
  },

  getCustomersByPincode: async (pincode: string): Promise<Customer[]> => {
    try {
      const response = await fetch(`/api/customers?pincode=${encodeURIComponent(pincode)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const customers = await response.json();
      return Array.isArray(customers) ? customers : [];
    } catch (error) {
      console.error('Error fetching customers by pincode:', error);
      throw error;
    }
  },

  updateCustomerKyc: async (custId: string, verified: boolean, userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(custId)}/kyc`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified, userId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating customer KYC:', error);
      return false;
    }
  },

  // Application methods
  createApplication: async (data): Promise<Application> => {
    try {
      const user = useAuth.getState().user;
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create application');
      }

      const application = await response.json();
      return application;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  getApplicationsByPincode: async (pincode: string): Promise<Application[]> => {
    try {
      const response = await fetch(`/api/applications?pincode=${encodeURIComponent(pincode)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const applications = await response.json();
      return Array.isArray(applications) ? applications : [];
    } catch (error) {
      console.error('Error fetching applications by pincode:', error);
      throw error;
    }
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(id)}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch application');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      return null;
    }
  },

  getActivitiesByApplicationId: async (appId: string): Promise<ActivityLog[]> => {
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(appId)}/activities`);

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const activities = await response.json();
      return Array.isArray(activities) ? activities : [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  saveApplicationForm: async (appId: string, formData: LoanFormData, userId: string): Promise<Application | null> => {
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(appId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", formData, userId }),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving application form:', error);
      return null;
    }
  },

  submitApplicationForm: async (appId: string, formData: LoanFormData, userId: string): Promise<Application | null> => {
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(appId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit", formData, userId }),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting application form:', error);
      return null;
    }
  },

  approveApplication: async (appId: string, userId: string, comment: string): Promise<Application | null> => {
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(appId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", userId, comment }),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving application:', error);
      return null;
    }
  },

  rejectApplication: async (appId: string, userId: string, comment: string): Promise<Application | null> => {
    try {
      const response = await fetch(`/api/applications/${encodeURIComponent(appId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", userId, comment }),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error rejecting application:', error);
      return null;
    }
  },
}));