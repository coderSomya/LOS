// app/forms/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { MainLayout } from "@/components/layout/main-layout";
import { Loader2, Save, Send } from "lucide-react";

import { PersonalDetails } from '@/components/forms/GoldLoanForm/PersonalDetails';
import { GoldLoanDetails } from '@/components/forms/GoldLoanForm/GoldLoanDetails';
import { AccountDetails } from "@/components/forms/GoldLoanForm/AccountDetails";

// Fix the schema with proper enums
const referenceSchema = z.object({
  name: z.string(),
  address: z.string(),
  mobile: z.string(),
  email: z.string().optional(),
  relationship: z.string(),
});

export const formSchema = z.object({
  personalDetails: z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    aadhar: z.string().regex(/^\d{12}$/, "Aadhar must be 12 digits"),
    voterId: z.string().optional(),
    mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
    email: z.string().email().optional().or(z.literal('')),
    spouseName: z.string().optional(),
    fatherName: z.string().optional(),
    gender: z.enum(['Male', 'Female', 'Third Gender']),
    maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widow']),
    religion: z.string().optional(),
    education: z.string().optional(),
    pan: z.string().optional(),
    residentialStatus: z.enum(['Resident Indian (RI)', 'Non-Resident Indian (NRI)']),
    visaNo: z.string().optional(),
    visaIssueDate: z.coerce.date().optional(),
    currentAddress: z.string().min(1, "Current address is required"),
    currentLandmark: z.string().optional(),
    currentCity: z.string().min(1, "City is required"),
    currentDistrict: z.string().min(1, "District is required"),
    currentState: z.string().min(1, "State is required"),
    currentPincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    currentCountry: z.string().min(1, "Country is required"),
    currentResidingInMonths: z.number().optional(),
    currentResidentialType: z.enum(['Rented', 'Company Lease', 'Owned', 'Parental House']).optional(),
    sameAsPermanent: z.enum(['Yes', 'No']),
    permanentAddress: z.string().optional(),
    permanentLandmark: z.string().optional(),
    permanentCity: z.string().optional(),
    permanentDistrict: z.string().optional(),
    permanentState: z.string().optional(),
    permanentPincode: z.string().optional(),
    permanentCountry: z.string().optional(),
    permanentResidingInMonths: z.number().optional(),
    permanentResidentialType: z.enum(['Rented', 'Company Lease', 'Owned', 'Parental House']).optional(),
    applicantRole: z.enum(['Applicant', 'Co-Applicant', 'Guarantor', 'Others']),
    occupationType: z.enum([
      'Salaried',
      'Self-Employed Professional (Doctor/Engr/Architect/CA)',
      'Self-Employed Professional Other Than Doctor/Engr/Architect/CA',
      'Business',
      'Agriculturist',
      'Retired',
      'Pensioner',
      'Student',
      'Home Maker',
      'Unemployed',
    ]),
    employerName: z.string().optional(),
    employerAddress: z.string().optional(),
    employerPin: z.string().optional(),
    references: z.array(referenceSchema).optional(),
  }),

  goldLoanDetails: z.object({
    typeOfApplicant: z.enum(['Applicant', 'Co-Applicant', 'Guarantor', 'Others']),
    loanAmount: z.number().min(1, "Loan amount is required"),
    tenor: z.number().min(1, "Tenor is required"),
    purposeOfLoan: z.enum([
      'Agri Allied Activity',
      'Business Expansion',
      'Education Purpose',
      'Medical Emergency',
      'Purchase of a new or old House/Flat/Plot',
      'Marriage',
      'Travels',
      'Construction/Renovation',
      'Repay Informal Sector Loan',
      'Others',
    ]),
    chain: z.number().optional(),
    bangles: z.number().optional(),
    rings: z.number().optional(),
    earrings: z.number().optional(),
    othersOrnaments: z.number().optional(),
    totalOrnaments: z.number().optional(),
    ornamentValue: z.number().optional(),
    insuranceOptIn: z.enum(['Yes', 'No']),
    insuranceScheme: z.string().optional(),
    premiumAmount: z.number().optional(),
    sumAssured: z.number().optional(),
    nominee: z.string().optional(),
    nomineeRelationship: z.string().optional(),
    referralFee: z.number().optional(),
    declarationDate: z.coerce.date().optional(),
  }),

  accountDetails: z.object({
    accountNo: z.string().min(1, 'Account Number is required'),
    accountType: z.enum(['Savings', 'Current', 'Overdraft']),
    accountHolderName: z.string().min(1, 'Account Holder Name is required'),
    companyName: z.string().optional(),
    branchName: z.string().optional(),
    ifscCode: z.string().min(1, 'IFSC Code is required'),
    siNachStartDate: z.string().min(1, 'SI/NACH Start Date is required'),
    takeoverCompanyName: z.string().optional(),
    numberOfTranches: z.number().optional(),
    sellerBuilderName: z.string().optional(),
    sellerBuilderAccountNo: z.string().optional(),
    sellerBuilderCompanyName: z.string().optional(),
    sellerBuilderBranchName: z.string().optional(),
    sellerBuilderIfscCode: z.string().optional(),
    existingLoanAccountNo: z.string().optional(),
    existingLoanCompanyName: z.string().optional(),
    existingLoanSanctionedAmount: z.number().optional(),
    existingLoanOutstanding: z.number().optional(),
    existingLoanEMI: z.number().optional(),
  }),
});

// Type the form data properly
type FormData = z.infer<typeof formSchema>;

const steps = [
  { title: 'Personal Details' },
  { title: 'Gold Loan Details' },
  { title: 'Account Details' },
];

export default function GoldLoanForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Get query parameters
  const leadId = searchParams.get('leadId');
  const customerId = searchParams.get('customerId');
  const applicationId = searchParams.get('applicationId');
  const isNewCustomer = searchParams.get('isNew') === 'true';
  const isEdit = searchParams.get('edit') === 'true';

  // Initialize form with proper type
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalDetails: {
        firstName: '',
        middleName: '',
        lastName: '',
        aadhar: '',
        voterId: '',
        mobile: '',
        email: '',
        spouseName: '',
        fatherName: '',
        gender: 'Male' as const,
        maritalStatus: 'Single' as const,
        religion: '',
        education: '',
        pan: '',
        residentialStatus: 'Resident Indian (RI)' as const,
        visaNo: '',
        visaIssueDate: undefined,
        currentAddress: '',
        currentLandmark: '',
        currentCity: '',
        currentDistrict: '',
        currentState: '',
        currentPincode: '',
        currentCountry: '',
        currentResidingInMonths: undefined,
        currentResidentialType: undefined,
        sameAsPermanent: 'Yes' as const,
        permanentAddress: '',
        permanentLandmark: '',
        permanentCity: '',
        permanentDistrict: '',
        permanentState: '',
        permanentPincode: '',
        permanentCountry: '',
        permanentResidingInMonths: undefined,
        permanentResidentialType: undefined,
        applicantRole: 'Applicant' as const,
        occupationType: 'Salaried' as const,
        employerName: '',
        employerAddress: '',
        employerPin: '',
        references: [],
      },
      goldLoanDetails: {
        typeOfApplicant: 'Applicant' as const,
        loanAmount: 0,
        tenor: 0,
        purposeOfLoan: 'Agri Allied Activity' as const,
        chain: undefined,
        bangles: undefined,
        rings: undefined,
        earrings: undefined,
        othersOrnaments: undefined,
        totalOrnaments: undefined,
        ornamentValue: undefined,
        insuranceOptIn: 'No' as const,
        insuranceScheme: '',
        premiumAmount: undefined,
        sumAssured: undefined,
        nominee: '',
        nomineeRelationship: '',
        referralFee: undefined,
        declarationDate: undefined,
      },
      accountDetails: {
        accountNo: '',
        accountType: 'Savings' as const,
        accountHolderName: '',
        companyName: '',
        branchName: '',
        ifscCode: '',
        siNachStartDate: '',
        takeoverCompanyName: '',
        numberOfTranches: undefined,
        sellerBuilderName: '',
        sellerBuilderAccountNo: '',
        sellerBuilderCompanyName: '',
        sellerBuilderBranchName: '',
        sellerBuilderIfscCode: '',
        existingLoanAccountNo: '',
        existingLoanCompanyName: '',
        existingLoanSanctionedAmount: undefined,
        existingLoanOutstanding: undefined,
        existingLoanEMI: undefined,
      }
    },
  });

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access this page.',
        variant: 'destructive',
      });
      router.push('/signin');
    }
  }, [user, router, toast]);

  // Load customer and application data
  useEffect(() => {
    const loadData = async () => {
      if (!customerId || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch customer data
        const customerResponse = await fetch(`/api/customers/${customerId}`);
        if (!customerResponse.ok) throw new Error('Failed to fetch customer');
        const customer = await customerResponse.json();
        setCustomerData(customer);

        // Parse and set customer name
        const nameParts = customer.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts[nameParts.length - 1] || '';
        const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';

        // Prefill form with customer data
        form.setValue('personalDetails.firstName', firstName);
        form.setValue('personalDetails.middleName', middleName);
        form.setValue('personalDetails.lastName', lastName);
        form.setValue('personalDetails.mobile', customer.phone);
        form.setValue('personalDetails.aadhar', customer.aadharNumber || '');
        form.setValue('personalDetails.pan', customer.panNumber || '');
        form.setValue('personalDetails.currentPincode', customer.pincode);

        // If editing or continuing, load existing form data
        if (applicationId) {
          const appResponse = await fetch(`/api/applications/${applicationId}`);
          if (appResponse.ok) {
            const application = await appResponse.json();
            setApplicationData(application);

            // Load form data from the structured tables
            if (application.personalDetails) {
              form.setValue('personalDetails', {
                ...form.getValues('personalDetails'),
                ...application.personalDetails,
              });
            }
            if (application.goldLoanDetails) {
              form.setValue('goldLoanDetails', application.goldLoanDetails);
            }
            if (application.accountDetails) {
              form.setValue('accountDetails', application.accountDetails);
            }

            // Set last saved time
            setLastSaved(new Date(application.updatedAt));
          }
        }

        // Show welcome message
        if (isNewCustomer) {
          toast({
            title: 'Welcome!',
            description: 'KYC completed successfully. Please complete your loan application.',
          });
        } else if (isEdit) {
          toast({
            title: 'Continue Application',
            description: 'You can continue from where you left off.',
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load application data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [customerId, applicationId, form, toast, isNewCustomer, isEdit, user]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (!form.formState.isDirty || isSaving) return;
      handleSaveDraft();
    }, 60000); // Auto-save every minute

    return () => clearInterval(autoSaveInterval);
  }, [form.formState.isDirty, isSaving]);

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof FormData | `${keyof FormData}.${string}`)[] = [];

    switch (currentStep) {
      case 0: // Personal Details
        fieldsToValidate = [
          'personalDetails.firstName',
          'personalDetails.lastName',
          'personalDetails.aadhar',
          'personalDetails.mobile',
          'personalDetails.currentAddress',
          'personalDetails.currentCity',
          'personalDetails.currentDistrict',
          'personalDetails.currentState',
          'personalDetails.currentPincode',
        ];
        break;
      case 1: // Gold Loan Details
        fieldsToValidate = [
          'goldLoanDetails.loanAmount',
          'goldLoanDetails.tenor',
          'goldLoanDetails.purposeOfLoan',
        ];
        break;
      case 2: // Account Details
        fieldsToValidate = [
          'accountDetails.accountNo',
          'accountDetails.accountType',
          'accountDetails.accountHolderName',
          'accountDetails.ifscCode',
          'accountDetails.siNachStartDate',
        ];
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate as any);
      return isValid;
    }

    return true;
  };

  const nextStep = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    // Save progress before moving to next step
    await handleSaveDraft();
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    try {
      setIsSaving(true);
      const formData = form.getValues();
      console.log(formData.personalDetails)
      console.log(formData.goldLoanDetails)
      console.log(formData.accountDetails)
      
      // Save to structured tables via API
      const response = await fetch(`/api/applications/${applicationId}/save-draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalDetails: formData.personalDetails,
          goldLoanDetails: formData.goldLoanDetails,
          accountDetails: formData.accountDetails,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      setLastSaved(new Date());
      form.formState.isDirty && form.reset(formData); // Reset dirty state
      
      toast({
        title: 'Draft Saved',
        description: 'Your progress has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: 'Save Error',
        description: 'Failed to save draft. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log(data)
      setIsSaving(true);

      if (!customerId || !user || !leadId) {
        toast({
          title: 'Error',
          description: 'Missing required information. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Submit the complete form
      const response = await fetch(`/api/applications/${applicationId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalDetails: data.personalDetails,
          goldLoanDetails: data.goldLoanDetails,
          accountDetails: data.accountDetails,
          status: 'FORM_SUBMITTED',
          userId: user.id,
          leadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      toast({
        title: 'Application Submitted Successfully!',
        description: `Your Gold Loan application (Lead ID: ${leadId}) has been submitted for review.`,
      });

      // Use client-side navigation instead of full page reload
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting the form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const StepperHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full h-10 w-10 flex items-center justify-center font-semibold text-white transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span
                className={`text-sm mt-2 text-center whitespace-nowrap ${
                  index === currentStep ? 'font-medium text-blue-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 mx-2 ${
                  index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading application details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!customerId || !leadId) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-muted-foreground mb-4">Invalid application parameters.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Gold Loan Application
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  Lead ID: {leadId} | Customer: {customerData?.name}
                </div>
              </div>
              {lastSaved && (
                <div className="text-sm text-muted-foreground">
                  Last saved: {new Date(lastSaved).toLocaleTimeString()}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <StepperHeader />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {currentStep === 0 && <PersonalDetails control={form.control} />}
                {currentStep === 1 && <GoldLoanDetails control={form.control} />}
                {currentStep === 2 && <AccountDetails control={form.control} />}

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0 || isSaving}
                    variant="secondary"
                  >
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      // disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button type="button" onClick={nextStep} disabled={isSaving}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Send className="mr-2 h-4 w-4" />
                        Submit Application
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}