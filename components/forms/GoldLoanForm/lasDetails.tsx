'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Control , useWatch} from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface LASDetailsProps {
  control: Control<any>;
}

export function LASDetails({ control }: LASDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const insuranceOptIn = useWatch({
      control,
      name: 'lasDetails.insuranceOptIn',
    });
  return (
    <>
    <div className="space-y-6">
      {/* Type of Applicant */}
      <FormField
        control={control}
        name="lasDetails.typeOfApplicant"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Applicant</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Applicant Type" />
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

      {/* Loan Amount & Tenor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="lasDetails.loanAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Loan Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lasDetails.tenor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenor (in Months)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Tenor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Purpose of Loan */}
      <FormField
        control={control}
        name="lasDetails.purposeOfLoan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purpose of Loan</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Purpose(s)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Agri Allied Activity">Agri Allied Activity</SelectItem>
                <SelectItem value="Business Expansion">Business Expansion</SelectItem>
                <SelectItem value="Education Purpose">Education Purpose</SelectItem>
                <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                <SelectItem value="Purchase of a new or old House/Flat/Plot">
                  Purchase of a new or old House/Flat/Plot
                </SelectItem>
                <SelectItem value="Marriage">Marriage</SelectItem>
                <SelectItem value="Travels">Travels</SelectItem>
                <SelectItem value="Construction/Renovation">
                  Construction/Renovation of a new/old House/Flat
                </SelectItem>
                <SelectItem value="Repay Informal Sector Loan">Repay Informal Sector Loan</SelectItem>
                <SelectItem value="Others">Others (If Any)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Securities Being Pledged Section */}
      <div className="space-y-4">
        <FormLabel className="text-lg font-semibold">Securities Being Pledged (Only for LAS)</FormLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="lasDetails.securitiesBeingPledged.shares"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shares</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Value of Shares" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.securitiesBeingPledged.mfUnits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MF Units</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Value of MF Units" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.securitiesBeingPledged.bonds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bonds</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Value of Bonds" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.securitiesBeingPledged.insurancePolicy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Policy</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Value of Insurance Policy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.securitiesBeingPledged.eGoldSilver"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-Gold/Silver</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Value of E-Gold/Silver" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.securitiesBeingPledged.others"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Others</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Value of Others" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Total Value */}
        <FormField
          control={control}
          name="lasDetails.securitiesBeingPledged.totalValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Value of Shares/MF/Bonds/Insurance/Others (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Total Value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
        <>
      <FormField
        control={control}
        name="lasDetails.insuranceOptIn"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Would you like to avail Insurance?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="Yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="No" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {insuranceOptIn === 'Yes' && (
        <div className="space-y-4">
          <FormField
            control={control}
            name="lasDetails.insuranceScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheme</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Scheme Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="lasDetails.premiumAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Premium Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Premium Amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lasDetails.sumAssured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sum Assured (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Sum Assured"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="lasDetails.nominee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominee</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Nominee Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.nomineeRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship with Nominee</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Relationship" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.referralFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral Fee (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Referral Fee"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="lasDetails.declarationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="link" type="button" onClick={() => setIsModalOpen(true)}>
            View Terms & Conditions
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="text-sm max-h-[60vh] overflow-y-auto space-y-3">
            <p>
              I hereby confirm I am the owner of the Gold and indemnify the Company against any claim on the Gold from any other person or entity.
            </p>
            <p>
              I confirm all information provided is true and complete, with no material details withheld.
            </p>
            <p>
              I acknowledge the Company is not liable for consequences arising from erroneous details provided by me.
            </p>
            <p>
              I authorize the Company to perform credit checks as deemed necessary.
            </p>
            <p>
              Loan sanctioning is at the sole discretion of the Company.
            </p>
            <p>
              I agree to abide by the terms in the sanction letter and will use the loan only for permitted purposes.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
    </>
  );
}
