'use client';

import { useState } from 'react';

import { Control, useWatch } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddressDetailsProps {
  control: Control<any>;
}

export function AddressDetails({ control }: AddressDetailsProps) {
  const sameAsPermanent = useWatch({
    control,
    name: 'addressDetails.sameAsPermanent',
  });

  return (
    <div className="space-y-6">
      {/* Current Address */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="addressDetails.currentAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentLandmark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Landmark</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Landmark" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="Enter District" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentPincode"
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

          <FormField
            control={control}
            name="addressDetails.currentCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentResidingInMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residing in Months</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Number of Months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="addressDetails.currentResidentialType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residential Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Residential Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Company Lease">Company Lease</SelectItem>
                    <SelectItem value="Owned">Owned</SelectItem>
                    <SelectItem value="Parental House">Parental House</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Same as Permanent */}
      <FormField
        control={control}
        name="addressDetails.sameAsPermanent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Is Current Address same as Permanent?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex space-x-4"
              >
                <FormItem>
                  <RadioGroupItem value="Yes" id="yes" />
                  <FormLabel htmlFor="yes" className="ml-2">Yes</FormLabel>
                </FormItem>
                <FormItem>
                  <RadioGroupItem value="No" id="no" />
                  <FormLabel htmlFor="no" className="ml-2">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Permanent Address (Conditional) */}
      {sameAsPermanent === 'No' && (
        <div>
          <h3 className="text-lg font-semibold mt-6 mb-2">Permanent Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="addressDetails.permanentAddress"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter permanent address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {[
              'permanentLandmark',
              'permanentCity',
              'permanentDistrict',
              'permanentState',
              'permanentPincode',
              'permanentCountry',
              'permanentResidingInMonths',
            ].map((name) => (
              <FormField
                key={name}
                control={control}
                name={`addressDetails.${name}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{name.replace('permanent', '').replace(/([A-Z])/g, ' $1')}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${name}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <FormField
              control={control}
              name="addressDetails.permanentResidentialType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residential Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Residential Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Company Lease">Company Lease</SelectItem>
                      <SelectItem value="Owned">Owned</SelectItem>
                      <SelectItem value="Parental House">Parental House</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
