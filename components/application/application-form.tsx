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
  DialogFooter
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
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CustomerType, LoanType } from "@/types";
import { KYCForm } from "@/components/application/kyc-form";
import { toast } from "sonner";

export default function ApplicationForm({ 
  open, 
  onClose,
  onSuccess
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
    submitApplicationForm 
  } = useDataStore();
  
  // Initial form state
  const [step, setStep] = useState(1);
  const [loanType, setLoanType] = useState<LoanType | "">("");
  const [customerType, setCustomerType] = useState<CustomerType | "">("");
  const [custId, setCustId] = useState("");
  const [existingCustomer, setExistingCustomer] = useState(null);
  const [showKYCForm, setShowKYCForm] = useState(false);
  
  // Form data state
  const [applicationId, setApplicationId] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    loanAmount: "",
    loanPurpose: "",
    employmentStatus: "",
    monthlyIncome: "",
    existingLoans: "false",
    leadSource: ""
  });
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const handleSearchCustomer = () => {
    if (!custId.trim()) {
      toast.error("Please enter a Customer ID");
      return;
    }
    
    const customer = getCustomerById(custId);
    
    if (customer) {
      setExistingCustomer(customer);
      setFormData(prev => ({
        ...prev,
        fullName: customer.name,
      }));
      setStep(3);
    } else {
      toast.error("Customer not found. Please check the Customer ID.");
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
      
      if (customerType === CustomerType.NTC) {
        setShowKYCForm(true);
      }
    }
  };
  
  const handleCustomerCreated = (customer) => {
    setExistingCustomer(customer);
    setShowKYCForm(false);
    setStep(3);
    setFormData(prev => ({
      ...prev,
      fullName: customer.name,
    }));
    
    // Create new application
    if (user) {
      const newApp = createApplication({
        customerId: customer.id,
        pincode: customer.pincode,
        loanType: loanType as LoanType,
        userId: user.id
      });
      
      setApplicationId(newApp.id);
      toast.success("KYC details saved. Please fill the loan application form.");
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked.toString() : value
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }
    
    if (!formData.loanAmount.trim()) {
      newErrors.loanAmount = "Loan amount is required";
      isValid = false;
    } else if (isNaN(Number(formData.loanAmount)) || Number(formData.loanAmount) <= 0) {
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
    
    if (!formData.monthlyIncome.trim()) {
      newErrors.monthlyIncome = "Monthly income is required";
      isValid = false;
    } else if (isNaN(Number(formData.monthlyIncome)) || Number(formData.monthlyIncome) <= 0) {
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
  
  const handleSave = () => {
    if (!validateForm()) return;
    
    if (user && applicationId) {
      const processedData = {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        monthlyIncome: Number(formData.monthlyIncome),
        existingLoans: formData.existingLoans === "true"
      };
      
      const result = saveApplicationForm(applicationId, processedData, user.id);
      
      if (result) {
        toast.success("Application saved successfully");
        onSuccess();
      } else {
        toast.error("Failed to save application");
      }
    }
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    if (user && applicationId) {
      const processedData = {
        ...formData,
        loanAmount: Number(formData.loanAmount),
        monthlyIncome: Number(formData.monthlyIncome),
        existingLoans: formData.existingLoans === "true"
      };
      
      const result = submitApplicationForm(applicationId, processedData, user.id);
      
      if (result) {
        toast.success("Application submitted successfully");
        onSuccess();
      } else {
        toast.error("Failed to submit application");
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
            {step === 2 && customerType === CustomerType.ETC && "Enter existing customer information"}
            {step === 2 && customerType === CustomerType.NTC && "Enter new customer information"}
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
                  <TabsTrigger value={CustomerType.ETC}>
                    Existing Customer (ETC)
                  </TabsTrigger>
                  <TabsTrigger value={CustomerType.NTC}>
                    New Customer (NTC)
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleNext}>Next</Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 2 && customerType === CustomerType.ETC && (
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
                Enter the Customer ID to retrieve existing customer information
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            </DialogFooter>
          </div>
        )}
        
        {showKYCForm && (
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
                  placeholder="Enter amount"
                  value={formData.loanAmount}
                  onChange={handleFormChange}
                  className={errors.loanAmount ? "border-destructive" : ""}
                />
                {errors.loanAmount && <p className="text-xs text-destructive">{errors.loanAmount}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Select 
                  value={formData.employmentStatus} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employmentStatus: value }))}
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
                  placeholder="Enter monthly income"
                  value={formData.monthlyIncome}
                  onChange={handleFormChange}
                  className={errors.monthlyIncome ? "border-destructive" : ""}
                />
                {errors.monthlyIncome && <p className="text-xs text-destructive">{errors.monthlyIncome}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="existingLoans">Existing Loans</Label>
                <Select 
                  value={formData.existingLoans} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, existingLoans: value }))}
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
                  onValueChange={(value) => setFormData(prev => ({ ...prev, leadSource: value }))}
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
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleSave}>Save Draft</Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}