'use client';

import React, { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Control, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface InsuranceDeclarationProps {
  control: Control<any>;
}

export function InsuranceDeclaration({ control }: InsuranceDeclarationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const insuranceOptIn = useWatch({
    control,
    name: 'insuranceDeclaration.insuranceOptIn',
  });

  return (
    <>
      <FormField
        control={control}
        name="insuranceDeclaration.insuranceOptIn"
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
            name="insuranceDeclaration.insuranceScheme"
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
              name="insuranceDeclaration.premiumAmount"
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
              name="insuranceDeclaration.sumAssured"
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
            name="insuranceDeclaration.nominee"
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
            name="insuranceDeclaration.nomineeRelationship"
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
            name="insuranceDeclaration.referralFee"
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
            name="insuranceDeclaration.declarationDate"
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
  );
}
