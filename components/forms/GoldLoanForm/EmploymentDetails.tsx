// components/forms/GoldLoanForm/EmploymentDetails.tsx
'use client';

import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EmploymentDetailsProps {
  control: Control<any>;
}

export function EmploymentDetails({ control }: EmploymentDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Applicant Role */}
      <FormField
        control={control}
        name="employmentDetails.applicantRole"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Applicant Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Applicant">Applicant</SelectItem>
                <SelectItem value="Co-Applicant">Co-Applicant</SelectItem>
                <SelectItem value="Guarantor">Guarantor</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Occupation Type */}
      <FormField
        control={control}
        name="employmentDetails.occupationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Occupation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Salaried">Salaried</SelectItem>
                <SelectItem value="Self-Employed Professional (Doctor/Engr/Architect/CA)">
                  Self-Employed Professional (Doctor/Engr/Architect/CA)
                </SelectItem>
                <SelectItem value="Self-Employed Professional Other Than Doctor/Engr/Architect/CA">
                  Self-Employed Professional Other Than Doctor/Engr/Architect/CA
                </SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Agriculturist">Agriculturist</SelectItem>
                <SelectItem value="Retired">Retired</SelectItem>
                <SelectItem value="Pensioner">Pensioner</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Home Maker">Home Maker</SelectItem>
                <SelectItem value="Unemployed">Unemployed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Employer/Business Name */}
      <FormField
        control={control}
        name="employmentDetails.employerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer/Business Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Employer or Business Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Employer Address */}
      <FormField
        control={control}
        name="employmentDetails.employerAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employer/Business Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Example of PIN Code field */}
      <FormField
        control={control}
        name="employmentDetails.employerPin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PIN Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter PIN Code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Add remaining fields as shown above in similar pattern... */}
    </div>
  );
}
