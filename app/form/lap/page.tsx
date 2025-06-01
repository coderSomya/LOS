'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

import { PersonalDetails } from '@/components/forms/GoldLoanForm/PersonalDetails';
import { AddressDetails } from '@/components/forms/GoldLoanForm/AddressDetails';
import { EmploymentDetails } from '@/components/forms/GoldLoanForm/EmploymentDetails';
import { LAPDetails } from '@/components/forms/GoldLoanForm/CollateralDetails';
import { References } from '@/components/forms/GoldLoanForm/References';
import { InsuranceDeclaration } from '@/components/forms/GoldLoanForm/InsuranceDeclaration';
import { AccountDetails } from "@/components/forms/GoldLoanForm/AccountDetails";
import * as z from 'zod';
import { MainLayout } from "@/components/layout/main-layout";

const referenceSchema = z.object({
  name: z.string(),
  address: z.string(),
  mobile: z.string(),
  email: z.string().optional(),
  relationship: z.string(),
});

export const formSchema = z.object({
  personalDetails: z.object({
      firstName: z.string(),
      middleName: z.string().optional(),
      lastName: z.string(),
      aadhar: z.string(),
      voterId: z.string().optional(),
      mobile: z.string(),
      email: z.string().optional(),
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
      currentAddress: z.string(),
      currentLandmark: z.string().optional(),
      currentCity: z.string(),
      currentDistrict: z.string(),
      currentState: z.string(),
      currentPincode: z.string(),
      currentCountry: z.string(),
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

  // addressDetails: z.object({
  //   currentAddress: z.string(),
  //   currentLandmark: z.string().optional(),
  //   currentCity: z.string(),
  //   currentDistrict: z.string(),
  //   currentState: z.string(),
  //   currentPincode: z.string(),
  //   currentCountry: z.string(),
  //   currentResidingInMonths: z.number().optional(),
  //   currentResidentialType: z.enum(['Rented', 'Company Lease', 'Owned', 'Parental House']).optional(),
  //   sameAsPermanent: z.enum(['Yes', 'No']),
  //   permanentAddress: z.string().optional(),
  //   permanentLandmark: z.string().optional(),
  //   permanentCity: z.string().optional(),
  //   permanentDistrict: z.string().optional(),
  //   permanentState: z.string().optional(),
  //   permanentPincode: z.string().optional(),
  //   permanentCountry: z.string().optional(),
  //   permanentResidingInMonths: z.number().optional(),
  //   permanentResidentialType: z.enum(['Rented', 'Company Lease', 'Owned', 'Parental House']).optional(),
  // }),

  // employmentDetails: z.object({
  //   applicantRole: z.enum(['Applicant', 'Co-Applicant', 'Guarantor', 'Others']),
  //   occupationType: z.enum([
  //     'Salaried',
  //     'Self-Employed Professional (Doctor/Engr/Architect/CA)',
  //     'Self-Employed Professional Other Than Doctor/Engr/Architect/CA',
  //     'Business',
  //     'Agriculturist',
  //     'Retired',
  //     'Pensioner',
  //     'Student',
  //     'Home Maker',
  //     'Unemployed',
  //   ]),
  //   employerName: z.string().optional(),
  //   employerAddress: z.string().optional(),
  //   employerPin: z.string().optional(),
  // }),

  lapDetails : z.object({
  typeOfApplicant: z.enum(['Applicant', 'Co-Applicant', 'Guarantor', 'Others']),
  loanAmount: z.number(),
  tenor: z.number(),
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
  securitiesBeingPledged: z.object({
    shares: z.number().optional(),
    mfUnits: z.number().optional(),
    bonds: z.number().optional(),
    insurancePolicy: z.number().optional(),
    eGoldSilver: z.number().optional(),
    others: z.number().optional(),
    totalValue: z.number().optional(),
  }),
  insuranceOptIn: z.enum(['Yes', 'No']),
    insuranceScheme: z.string().optional(),
    premiumAmount: z.number().optional(),
    sumAssured: z.number().optional(),
    nominee: z.string().optional(),
    nomineeRelationship: z.string().optional(),
    referralFee: z.number().optional(),
    declarationDate: z.coerce.date().optional(),
}),
  // references: z.array(referenceSchema).optional(),

  accountDetails : z.object({
  accountNo: z.string().min(1, 'Account Number is required'),
  accountType: z.enum(['Savings', 'Current', 'Overdraft']),
  accountHolderName: z.string().min(1, 'Account Holder Name is required'),
  companyName: z.string().optional(),
  branchName: z.string().optional(),
  ifscCode: z.string().min(1, 'IFSC Code is required'),

  siNachStartDate: z.string().min(1, 'SI/NACH Start Date is required'), // Can also use date() if you want strict date validation

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

  insuranceDeclaration: z.object({
    insuranceOptIn: z.enum(['Yes', 'No']),
    insuranceScheme: z.string().optional(),
    premiumAmount: z.number().optional(),
    sumAssured: z.number().optional(),
    nominee: z.string().optional(),
    nomineeRelationship: z.string().optional(),
    referralFee: z.number().optional(),
    declarationDate: z.coerce.date().optional(),
  }),
});


const steps = [
  { title: 'Personal Details' },
  // { title: 'Address Details' },
  // { title: 'Employment Details' },
  { title: 'LAP Details' },
  // { title: 'References' },
//   { title: 'Insurance Declaration' },
  { title: 'Account Details' },
  // { title: 'Documents' }, // Optional
];

export default function GoldLoanForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

const form = useForm({
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
      gender: 'Male',
      maritalStatus: 'Single',
      religion: '',
      education: '',
      pan: '',
      residentialStatus: 'Resident Indian (RI)',
      visaNo: '',
      visaIssueDate: undefined,
    },
    addressDetails: {
      currentAddress: '',
      currentLandmark: '',
      currentCity: '',
      currentDistrict: '',
      currentState: '',
      currentPincode: '',
      currentCountry: '',
      currentResidingInMonths: undefined,
      currentResidentialType: undefined,
      sameAsPermanent: 'Yes',
      permanentAddress: '',
      permanentLandmark: '',
      permanentCity: '',
      permanentDistrict: '',
      permanentState: '',
      permanentPincode: '',
      permanentCountry: '',
      permanentResidingInMonths: undefined,
      permanentResidentialType: undefined,
    },
    employmentDetails: {
      applicantRole: 'Applicant',
      occupationType: 'Salaried',
      employerName: '',
      employerAddress: '',
      employerPin: '',
    },

    collateralDetails : z.object({
  projectNameAndRera: z.string().optional(),
  propertyHolderName: z.string().optional(),
  jointHolderName: z.string().optional(),
  propertyType: z.enum([
    'Residential',
    'Commercial',
    'Factory/Godown',
    'Hotel/Guest House',
    'School/College',
    'Land',
    'Others',
  ]).optional(),
  propertyStatus: z.enum([
    'Flat/Home/Bungalow/Villas',
    'Self Construction',
    'Under construction - Apartment/Society',
    'Resale flat/House',
    'Office/Shop/Mall',
    'Under construction',
    'Construction not started',
    'Vacant or Agri land',
    'Others',
  ]).optional(),
  propertyValue: z.number().optional(),
  propertyHeldInNameOf: z.string().optional(),
  processingFeeAmount: z.number().optional(),
  saleTransactionCategory: z.enum([
    'Normal sale',
    'POA Sale',
    'Gift deed',
    'Sale through third party Guarantor',
  ]).optional(),
  builtUpArea: z.number().optional(),
  carpetArea: z.number().optional(),
  buildingName: z.string().optional(),
  wingBlockName: z.string().optional(),
  floorFlatNo: z.string().optional(),
  plotOrDagNo: z.string().optional(),
  khaitanNo: z.string().optional(),
  propertyAge: z.number().optional(),
  propertyLocation: z.enum([
    'Corporation',
    'Municipality',
    'Gram Panchayet',
  ]).optional(),
  address: z.string().optional(),
  landmark: z.string().optional(),
  district: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pinCode: z.string().optional(),
  marginMoneySource: z.enum([
    'Own savings',
    'From friend and relatives',
    'Realty gold loan',
    'Other loan',
    'Others',
  ]).optional(),

  collateralType: z.enum([
    'Term Deposit',
    'NSC/KVP',
    'Life Insurance Policy',
    'Govt. Promissory Note',
    'Immovable Property',
    'Third Party Guarantee',
  ]).optional(),
  collateralOwner: z.string().optional(),
  collateralDescription: z.string().optional(),
  collateralValue: z.number().optional(),
  collateralLienValue: z.number().optional(),
  collateralAddress: z.string().optional(),
}),


    references: [],
    insuranceDeclaration: {
      insuranceOptIn: 'No',
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
  accountType: 'Savings',  // Default to 'Savings' or adjust based on your design
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


  const nextStep = async () => {
    console.log("heere")
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: any) => {
    try {
      console.log("data from form : "+JSON.stringify(data))
      const isValid = await form.trigger();
      console.log(isValid)
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-form',
          loanType: 'gold',
          data,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      const result = await response.json();

      toast({
        title: 'Gold Loan Form Submitted',
        description: `Lead ID: ${result.leadId || 'Created Successfully'}`,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting the form.',
        variant: 'destructive',
      });
    }
  };

  const StepperHeader = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center font-semibold text-white ${
              index === currentStep
                ? 'bg-blue-600'
                : index < currentStep
                ? 'bg-green-600'
                : 'bg-gray-300'
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`text-sm mt-2 text-center ${
              index === currentStep ? 'font-medium text-blue-600' : 'text-gray-500'
            }`}
          >
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <MainLayout>

    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            LAP Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StepperHeader />

          <Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit, (errors) => {
      console.log('Validation errors:', errors);
    })}
    className="space-y-6"
  >
    {currentStep === 0 && <PersonalDetails control={form.control} />}
    {/* {currentStep === 1 && <AddressDetails control={form.control} />}
    {currentStep === 2 && <EmploymentDetails control={form.control} />} */}
    {currentStep === 1 && <LAPDetails control={form.control} />}
    {/* {currentStep === 4 && <References control={form.control} />} */}
    {/* {currentStep === 2 && <InsuranceDeclaration control={form.control} />} */}
    {currentStep === 2 && < AccountDetails control={ form.control} />}

    <div className="flex justify-between pt-4">
      <Button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 0}
        variant="secondary"
      >
        Previous
      </Button>

      {currentStep < steps.length - 1 ? (
        <Button type="button" onClick={nextStep}>
          Next
        </Button>
      ) : (
        <Button type="submit">Submit</Button>
      )}
    </div>
  </form>
</Form>

        </CardContent>
      </Card>
    </div>
    </MainLayout>

  );
}
