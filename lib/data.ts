"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  Customer, 
  Application, 
  ActivityLog, 
  AppStatus, 
  ActionType, 
  LoanType,
  LoanFormData,
  KycFormData
} from "@/types";
import { v4 as uuidv4 } from "uuid";

interface DataState {
  customers: Customer[];
  applications: Application[];
  activityLogs: ActivityLog[];
  addCustomer: (customerData: KycFormData) => Customer;
  getCustomerById: (custId: string) => Customer | undefined;
  getCustomerByPhone: (phone: string) => Customer | undefined;
  updateCustomerKyc: (custId: string, verified: boolean, userId: string) => boolean;
  createApplication: (data: {
    customerId: string,
    pincode: string,
    loanType: LoanType,
    userId: string
  }) => Application;
  updateApplication: (
    appId: string,
    data: Partial<Application>,
    userId: string,
    comment: string,
    actionType: ActionType
  ) => Application | null;
  getApplicationsByPincode: (pincode: string) => Application[];
  getApplicationById: (id: string) => Application | undefined;
  getActivitiesByApplicationId: (appId: string) => ActivityLog[];
  saveApplicationForm: (
    appId: string,
    formData: LoanFormData,
    userId: string
  ) => Application | null;
  submitApplicationForm: (
    appId: string,
    formData: LoanFormData,
    userId: string
  ) => Application | null;
  approveApplication: (
    appId: string,
    userId: string,
    comment: string
  ) => Application | null;
  rejectApplication: (
    appId: string,
    userId: string,
    comment: string
  ) => Application | null;
}

// Generate a customer ID with format LOS-CUST-XXXXX
const generateCustomerId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `LOS-CUST-${random}`;
};

// Generate a temp app ID with format TEMP-XXXXX
const generateTempAppId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `TEMP-${random}`;
};

// Generate an app ID with format LOS-APP-XXXXX
const generateAppId = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `LOS-APP-${random}`;
};

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      customers: [],
      applications: [],
      activityLogs: [],

      // Customer methods
      addCustomer: (customerData: KycFormData) => {
        const custId = generateCustomerId();
        const newCustomer: Customer = {
          id: uuidv4(),
          custId,
          name: customerData.name,
          phone: customerData.phone,
          pincode: customerData.pincode,
          aadharNumber: customerData.aadharNumber,
          panNumber: customerData.panNumber,
          kycVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));

        return newCustomer;
      },

      getCustomerById: (custId: string) => {
        return get().customers.find((c) => c.custId === custId);
      },

      getCustomerByPhone: (phone: string) => {
        return get().customers.find((c) => c.phone === phone);
      },

      updateCustomerKyc: (custId: string, verified: boolean, userId: string) => {
        let success = false;

        set((state) => {
          const customers = state.customers.map((c) => {
            if (c.custId === custId) {
              success = true;
              return {
                ...c,
                kycVerified: verified,
                updatedAt: new Date().toISOString()
              };
            }
            return c;
          });

          return { customers };
        });

        if (success) {
          // Find applications for this customer to add activity
          const customer = get().customers.find(c => c.custId === custId);
          if (customer) {
            const applications = get().applications.filter(a => a.customerId === customer.id);
            for (const app of applications) {
              const newActivity: ActivityLog = {
                id: uuidv4(),
                applicationId: app.id,
                actionType: ActionType.KYC_VERIFIED,
                comment: verified ? "KYC verified" : "KYC verification revoked",
                performedBy: userId,
                performedAt: new Date().toISOString(),
              };

              set((state) => ({
                activityLogs: [...state.activityLogs, newActivity],
              }));
            }
          }
        }

        return success;
      },

      // Application methods
      createApplication: (data) => {
        const newApplication: Application = {
          id: uuidv4(),
          leadId: `LEAD-${Math.floor(100000 + Math.random() * 900000)}`,
          customerId: data.customerId,
          pincode: data.pincode,
          loanType: data.loanType,
          status: AppStatus.DRAFT,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          applications: [...state.applications, newApplication],
        }));

        // Add activity log
        const newActivity: ActivityLog = {
          id: uuidv4(),
          applicationId: newApplication.id,
          actionType: ActionType.CREATED,
          comment: "Application created",
          performedBy: data.userId,
          performedAt: new Date().toISOString(),
        };

        set((state) => ({
          activityLogs: [...state.activityLogs, newActivity],
        }));

        return newApplication;
      },

      updateApplication: (appId, data, userId, comment, actionType) => {
        let updatedApp: Application | null = null;

        set((state) => {
          const applications = state.applications.map((app) => {
            if (app.id === appId) {
              updatedApp = {
                ...app,
                ...data,
                updatedAt: new Date().toISOString(),
              };
              return updatedApp;
            }
            return app;
          });

          return { applications };
        });

        if (updatedApp) {
          const newActivity: ActivityLog = {
            id: uuidv4(),
            applicationId: appId,
            actionType,
            comment,
            performedBy: userId,
            performedAt: new Date().toISOString(),
          };

          set((state) => ({
            activityLogs: [...state.activityLogs, newActivity],
          }));
        }

        return updatedApp;
      },

      getApplicationsByPincode: (pincode) => {
        const apps = get().applications.filter((app) => app.pincode === pincode);
        const customers = get().customers;
        
        // Enrich applications with customer data
        return apps.map(app => {
          const customer = customers.find(c => c.id === app.customerId);
          return {
            ...app,
            customer
          };
        });
      },

      getApplicationById: (id) => {
        const app = get().applications.find((app) => app.id === id);
        if (!app) return undefined;

        const customer = get().customers.find(c => c.id === app.customerId);
        
        return {
          ...app,
          customer
        };
      },

      getActivitiesByApplicationId: (appId) => {
        return get().activityLogs.filter(
          (log) => log.applicationId === appId
        ).sort((a, b) => 
          new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
        );
      },

      saveApplicationForm: (appId, formData, userId) => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return null;

        // Generate temp app ID if not exists
        const tempAppId = app.tempAppId || generateTempAppId();

        return get().updateApplication(
          appId,
          {
            formData,
            tempAppId,
          },
          userId,
          "Application form saved",
          ActionType.SAVED
        );
      },

      submitApplicationForm: (appId, formData, userId) => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return null;

        // Generate final app ID
        const appIdFinal = app.appId || generateAppId();

        return get().updateApplication(
          appId,
          {
            formData,
            appId: appIdFinal,
            status: AppStatus.FORM_SUBMITTED,
          },
          userId,
          "Application form submitted",
          ActionType.SUBMITTED
        );
      },

      approveApplication: (appId, userId, comment) => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return null;

        // Check if customer KYC is verified
        const customer = get().customers.find(c => c.id === app.customerId);
        if (!customer?.kycVerified) return null;

        return get().updateApplication(
          appId,
          {
            status: AppStatus.LOAN_APPROVED,
          },
          userId,
          comment || "Loan application approved",
          ActionType.APPROVED
        );
      },

      rejectApplication: (appId, userId, comment) => {
        const app = get().applications.find((a) => a.id === appId);
        if (!app) return null;

        return get().updateApplication(
          appId,
          {
            status: AppStatus.LOAN_REJECTED,
          },
          userId,
          comment || "Loan application rejected",
          ActionType.REJECTED
        );
      },
    }),
    {
      name: "los-data-storage",
    }
  )
);