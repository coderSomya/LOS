"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Customer, LoanType } from "@/types";
import { KYCForm } from "@/components/application/kyc-form";
import { toast } from "sonner";

interface LoanFormData {
  fullName: string;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  monthlyIncome: number;
  existingLoans: boolean;
  leadSource: string;
}

type CustomerType = "ETC" | "NTC";

export default function ApplicationForm({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const {
    createApplication,
    getCustomerById,
    saveApplicationForm,
    submitApplicationForm,
  } = useDataStore();

  const [step, setStep] = useState<number>(1);
  const [loanType, setLoanType] = useState<LoanType | "">("");
  const [customerType, setCustomerType] = useState<CustomerType | "">("");
  const [custId, setCustId] = useState<string>("");
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);
  const [showKYCForm, setShowKYCForm] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string>("");
  const [formData, setFormData] = useState<LoanFormData>({
    fullName: "",
    loanAmount: 0,
    loanPurpose: "",
    employmentStatus: "",
    monthlyIncome: 0,
    existingLoans: false,
    leadSource: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoanFormData, string>>>({});

  const handleSearchCustomer = async () => {
    if (!custId.trim()) {
      toast.error("Please enter a Customer ID");
      return;
    }
    try {
      const customer = await getCustomerById(custId);
      if (customer) {
        setExistingCustomer(customer);
        setFormData((prev) => ({
          ...prev,
          fullName: customer.name,
        }));
        setStep(3);

        if (user) {
          const newApp = await createApplication({
            customerId: customer.id,
            pincode: customer.pincode,
            loanType: loanType as LoanType,
            userId: user.id,
          });
          setApplicationId(newApp.id);
        }
      } else {
        toast.error("Customer not found. Please check the Customer ID.");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("An error occurred while fetching customer data.");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!loanType) {
        toast.error("Please select a loan type");
        return;
      }
      if (!customerType) {
        toast.error("Please select if the customer is ETC or NTC");
        return;
      }
      setStep(2);
      if (customerType === "NTC") {
        setShowKYCForm(true);
      }
    }
  };

  const handleCustomerCreated = async (customer: Customer) => {
    setExistingCustomer(customer);
    setShowKYCForm(false);
    setStep(3);
    setFormData((prev) => ({
      ...prev,
      fullName: customer.name,
    }));

    if (user) {
      try {
        const newApp = await createApplication({
          customerId: customer.id,
          pincode: customer.pincode,
          loanType: loanType as LoanType,
          userId: user.id,
        });
        setApplicationId(newApp.id);
        toast.success("KYC details saved. Please fill the loan application form.");
      } catch (error) {
        console.error("Error creating application:", error);
        toast.error("An error occurred while creating the application.");
      }
    }
  };

 const handleFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const target = e.target;
  const { name, value, type } = target;

  setFormData((prev) => ({
    ...prev,
    [name]:
      type === "checkbox" && target instanceof HTMLInputElement
        ? target.checked
        : type === "number"
        ? Number(value)
        : value,
  }));
};


  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoanFormData, string>> = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (formData.loanAmount <= 0) {
      newErrors.loanAmount = "Loan amount must be a positive number";
      isValid = false;
    }
    if (!formData.loanPurpose.trim()) {
      newErrors.loanPurpose = "Loan purpose is required";
      isValid = false;
    }
    if (!formData.employmentStatus.trim()) {
      newErrors.employmentStatus = "Employment status is required";
      isValid = false;
    }
    if (formData.monthlyIncome <= 0) {
      newErrors.monthlyIncome = "Monthly income must be a positive number";
      isValid = false;
    }
    if (!formData.leadSource.trim()) {
      newErrors.leadSource = "Lead source is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (user && applicationId) {
      const processedData = {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        monthlyIncome: Number(formData.monthlyIncome),
        existingLoans: formData.existingLoans === true,
      };

      try {
        const result = await saveApplicationForm(applicationId, processedData, user.id);
        if (result) {
          toast.success("Application saved successfully");
          onSuccess();
        } else {
          toast.error("Failed to save application");
        }
      } catch (error) {
        console.error("Error saving application:", error);
        toast.error("An error occurred while saving the application.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (user && applicationId) {
      const processedData = {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        monthlyIncome: Number(formData.monthlyIncome),
        existingLoans: formData.existingLoans === true,
      };

      try {
        const result = await submitApplicationForm(applicationId, processedData, user.id);
        if (result) {
          toast.success("Application submitted successfully");
          onSuccess();
        } else {
          toast.error("Failed to submit application");
        }
      } catch (error) {
        console.error("Error submitting application:", error);
        toast.error("An error occurred while submitting the application.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Loan Application</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select loan type and customer type"}
            {step === 2 && customerType === "ETC" && "Enter existing customer information"}
            {step === 2 && customerType === "NTC" && "Enter new customer information"}
            {step === 3 && "Fill the loan application form"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="loanType">Loan Type</Label>
              <Select
                value={loanType}
                onValueChange={(value) => setLoanType(value as LoanType)}
              >
                <SelectTrigger id="loanType">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LoanType.GOLD_LOAN}>Gold Loan</SelectItem>
                  <SelectItem value={LoanType.HOME_LOAN}>Home Loan</SelectItem>
                  <SelectItem value={LoanType.BUSINESS_LOAN}>Business Loan</SelectItem>
                  <SelectItem value={LoanType.PERSONAL_LOAN}>Personal Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customerType">Customer Type</Label>
              <Tabs
                value={customerType}
                onValueChange={(value) => setCustomerType(value as CustomerType)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ETC">Existing Customer (ETC)</TabsTrigger>
                  <TabsTrigger value="NTC">New Customer (NTC)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && customerType === "ETC" && (
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="custId">Customer ID</Label>
              <div className="flex gap-2">
                <Input
                  id="custId"
                  placeholder="Enter customer ID"
                  value={custId}
                  onChange={(e) => setCustId(e.target.value)}
                />
                <Button onClick={handleSearchCustomer}>Search</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the Customer ID to retrieve existing customer information.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </DialogFooter>
          </div>
        )}

        {showKYCForm && customerType === "NTC" && (
          <KYCForm
            onCancel={() => setStep(1)}
            onCustomerCreated={handleCustomerCreated}
          />
        )}

        {step === 3 && (
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  disabled={existingCustomer !== null}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input
                  id="loanAmount"
                  name="loanAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.loanAmount.toString()}
                  onChange={handleFormChange}
                  className={errors.loanAmount ? "border-destructive" : ""}
                />
                {errors.loanAmount && <p className="text-xs text-destructive">{errors.loanAmount}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select
                  value={formData.employmentStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, employmentStatus: value }))
                  }
                >
                  <SelectTrigger id="employmentStatus">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYED">Employed</SelectItem>
                    <SelectItem value="SELF_EMPLOYED">Self-Employed</SelectItem>
                    <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
                    <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentStatus && <p className="text-xs text-destructive">{errors.employmentStatus}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="monthlyIncome">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  type="number"
                  placeholder="Enter monthly income"
                  value={formData.monthlyIncome.toString()}
                  onChange={handleFormChange}
                  className={errors.monthlyIncome ? "border-destructive" : ""}
                />
                {errors.monthlyIncome && <p className="text-xs text-destructive">{errors.monthlyIncome}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="existingLoans">Existing Loans</Label>
                <Select
                  value={String(formData.existingLoans)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, existingLoans: value === "true" }))
                  }
                >
                  <SelectTrigger id="existingLoans">
                    <SelectValue placeholder="Do you have existing loans?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="leadSource">Lead Source</Label>
                <Select
                  value={formData.leadSource}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, leadSource: value }))
                  }
                >
                  <SelectTrigger id="leadSource">
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REFERRAL">Referral</SelectItem>
                    <SelectItem value="DIRECT">Direct</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="WEBSITE">Website</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.leadSource && <p className="text-xs text-destructive">{errors.leadSource}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="loanPurpose">Loan Purpose</Label>
              <Textarea
                id="loanPurpose"
                name="loanPurpose"
                placeholder="Describe the purpose of the loan"
                value={formData.loanPurpose}
                onChange={handleFormChange}
                rows={3}
                className={errors.loanPurpose ? "border-destructive" : ""}
              />
              {errors.loanPurpose && <p className="text-xs text-destructive">{errors.loanPurpose}</p>}
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave}>
                  Save Draft
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
