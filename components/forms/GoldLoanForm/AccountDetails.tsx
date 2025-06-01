'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface AccountDetailsProps {
  control: Control<any>;
}

export function AccountDetails({ control }: AccountDetailsProps) {
  return (
    <div className="space-y-6">
      {/* LOAN REPAYMENT ACCOUNT DETAILS */}
      <h2 className="text-lg font-semibold">Loan Repayment Account Details for Standing Instructions / NACH</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="accountDetails.accountNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter Account Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                  <SelectItem value="Overdraft">Overdraft</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.accountHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of Account Holder</FormLabel>
              <FormControl>
                <Input placeholder="Enter Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.branchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Branch Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.ifscCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter IFSC Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* SI / NACH Start Date */}
      <FormField
        control={control}
        name="accountDetails.siNachStartDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SI / NACH Start Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Takeover Loan Details */}
      <FormField
        control={control}
        name="accountDetails.takeoverCompanyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of Company (Takeover Loan)</FormLabel>
            <FormControl>
              <Input placeholder="Enter Company Name (if applicable)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Disbursement Schedule */}
      <h2 className="text-lg font-semibold mt-4">Disbursement Schedule</h2>

      <FormField
        control={control}
        name="accountDetails.numberOfTranches"
        render={({ field }) => (
          <FormItem>
            <FormLabel>No. of Tranches</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter Number of Tranches" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sellers / Builders Details */}
      <h2 className="text-lg font-semibold mt-4">Sellers / Builders Details for DD or Pay Order</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="accountDetails.sellerBuilderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of Seller / Builder</FormLabel>
              <FormControl>
                <Input placeholder="Enter Seller/Builder Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.sellerBuilderAccountNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter Account Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.sellerBuilderCompanyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.sellerBuilderBranchName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Branch Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.sellerBuilderIfscCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IFSC Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter IFSC Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Existing Loans */}
      <h2 className="text-lg font-semibold mt-4">Existing Loans (if any)</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="accountDetails.existingLoanAccountNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Account Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter Loan Account Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.existingLoanCompanyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company / FI Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Company / FI Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.existingLoanSanctionedAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sanctioned Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Sanctioned Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.existingLoanOutstanding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Present Outstanding</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Outstanding Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="accountDetails.existingLoanEMI"
          render={({ field }) => (
            <FormItem>
              <FormLabel>EMI</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter EMI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
