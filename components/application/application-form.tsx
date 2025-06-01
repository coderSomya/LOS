"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { useRouter } from "next/navigation";
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
import { Customer, LoanType, Application } from "@/types";
import { KYCForm } from "@/components/application/kyc-form";
import { toast } from "sonner";

type CustomerType = "ETC" | "NTC";

export default function ApplicationForm({
  open,
  onClose,
  onSuccess,
  editApplication,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editApplication?: Application | null;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { getCustomerById } = useDataStore();

  const [step, setStep] = useState<number>(1);
  const [loanType, setLoanType] = useState<LoanType | "">("");
  const [customerType, setCustomerType] = useState<CustomerType | "">("");
  const [custId, setCustId] = useState<string>("");
  const [leadId, setLeadId] = useState<string>("");
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(null);
  const [showKYCForm, setShowKYCForm] = useState<boolean>(false);

  // If editing an existing application, redirect immediately
  useEffect(() => {
    if (editApplication) {
      router.push(`/form/?leadId=${editApplication.leadId}&customerId=${editApplication.customerId}&edit=true`);
      onClose();
    }
  }, [editApplication, router, onClose]);

  // Handle search for ETC (Existing Customer)
  const handleSearchCustomer = async () => {
    if (!custId.trim()) {
      toast.error("Please enter a Customer ID");
      return;
    }

    try {
      const customer = await getCustomerById(custId);

      if (customer) {
        setExistingCustomer(customer);
        if (user) {
          onClose();
          router.push(`/form/?leadId=${leadId}&customerId=${customer.id}`);
        }
      } else {
        toast.error("Customer not found. Please check the Customer ID.");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("An error occurred while fetching customer data.");
    }
  };

  // Handle customer creation after KYC (NTC)
  const handleCustomerCreated = async (customer: Customer) => {
    setExistingCustomer(customer);
    setShowKYCForm(false);

    if (user) {
      try {
        onClose();
        toast.success("KYC completed successfully. Redirecting to application form...");
        router.push(`/form/?leadId=${leadId}&customerId=${customer.id}&isNew=true`);
      } catch (error) {
        console.error("Error after KYC:", error);
        toast.error("An error occurred after KYC.");
      }
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
      if (!leadId.trim()) {
        toast.error("Please enter a Lead ID");
        return;
      }

      if (loanType === LoanType.GOLD_LOAN) {
        setStep(2);
        if (customerType === "NTC") {
          setShowKYCForm(true);
        }
      } else {
        toast.info("Currently, only Gold Loan applications are supported in the detailed form.");
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setLoanType("");
    setCustomerType("");
    setCustId("");
    setLeadId("");
    setExistingCustomer(null);
    setShowKYCForm(false);
  };

  const handleClose = () => {
    if (!editApplication) {
      resetForm();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editApplication ? "Edit Application" : "New Loan Application"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Select loan type, customer type, and enter lead ID"}
            {step === 2 && customerType === "ETC" && "Enter existing customer information"}
            {step === 2 && customerType === "NTC" && "Enter new customer information"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && !editApplication && (
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="leadId">Lead ID</Label>
              <Input
                id="leadId"
                placeholder="Enter Lead ID (e.g., LEAD-123456)"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
              />
            </div>

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
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
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
            onCancel={() => {
              setShowKYCForm(false);
              setStep(1);
            }}
            onCustomerCreated={handleCustomerCreated}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
