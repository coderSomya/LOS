'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import React, { useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface LAPDetailsProps {
  control: Control<any>;
}

export function LAPDetails({ control }: LAPDetailsProps) {
   const [isModalOpen, setIsModalOpen] = useState(false);
     const insuranceOptIn = useWatch({
        control,
        name: 'lapDetails.insuranceOptIn',
      });
  return (
    <>
    <div className="space-y-6">
      {/* Existing LAS Details Code... */}
      {/* (Keep your existing LAS form as is, and append below content) */}

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Property Details</h2>

        {/* Project Name & RERA */}
        <FormField
          control={control}
          name="lapDetails.projectNameRera"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name & RERA Registration No</FormLabel>
              <FormControl>
                <Input placeholder="Enter Project Name & RERA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Holder Name */}
        <FormField
          control={control}
          name="lapDetails.propertyHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Property Holder Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Joint Holder Name */}
        <FormField
          control={control}
          name="lapDetails.jointHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joint Holder Name (If Any)</FormLabel>
              <FormControl>
                <Input placeholder="Enter Joint Holder Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Type */}
        <FormField
          control={control}
          name="lapDetails.propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Residential">Residential</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Factory/Godown">Factory/Godown</SelectItem>
                  <SelectItem value="Hotel/Guest House">Hotel/Guest House</SelectItem>
                  <SelectItem value="School/College">School/College</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Status */}
        <FormField
          control={control}
          name="lapDetails.propertyStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Property Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Flat/Home/Bungalow/Villas">Flat/Home/Bungalow/Villas</SelectItem>
                  <SelectItem value="Self Construction">Self Construction</SelectItem>
                  <SelectItem value="Under Construction - Apartment/Society">Under Construction - Apartment/Society</SelectItem>
                  <SelectItem value="Resale flat/House">Resale flat/House</SelectItem>
                  <SelectItem value="Office/Shop/Mall">Office/Shop/Mall</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                  <SelectItem value="Construction Not Started">Construction Not Started</SelectItem>
                  <SelectItem value="Vacant or Agri Land">Vacant or Agri Land</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Value */}
        <FormField
          control={control}
          name="lapDetails.propertyValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Value (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Property Value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Held In The Name Of */}
        <FormField
          control={control}
          name="lapDetails.heldInNameOf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Held In The Name Of</FormLabel>
              <FormControl>
                <Input placeholder="Enter Name(s)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Processing Fee */}
        <FormField
          control={control}
          name="lapDetails.processingFeeAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Processing Fee Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Processing Fee" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sale Transaction Category */}
        <FormField
          control={control}
          name="lapDetails.saleTransactionCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Transaction Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Normal Sale">Normal Sale</SelectItem>
                  <SelectItem value="POA Sale">POA Sale</SelectItem>
                  <SelectItem value="Gift Deed">Gift Deed</SelectItem>
                  <SelectItem value="Third Party Guarantor Sale">Third Party Guarantor Sale</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Built-Up Area */}
        <FormField
          control={control}
          name="lapDetails.builtUpArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Built-up / Super Built-up Area (Sq. Ft)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Built-up Area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Carpet Area */}
        <FormField
          control={control}
          name="lapDetails.carpetArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carpet Area (Sq. Ft)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Carpet Area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Building Details */}
        <FormField
          control={control}
          name="lapDetails.buildingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Building Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Wing/Block Name */}
        <FormField
          control={control}
          name="lapDetails.wingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wing/Block Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Wing/Block Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Floor & Flat No */}
        <FormField
          control={control}
          name="lapDetails.floorAndFlatNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor & Flat No</FormLabel>
              <FormControl>
                <Input placeholder="Enter Floor & Flat No" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Plot/Dag/Khaitan No */}
        <FormField
          control={control}
          name="lapDetails.plotDagKhaitanNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plot No / Dag No / Khaitan No</FormLabel>
              <FormControl>
                <Input placeholder="Enter Plot/Dag/Khaitan No" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Property Age */}
        <FormField
          control={control}
          name="lapDetails.propertyAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Age (Years)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter Property Age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Details */}
        {/* Location, Address, Landmark, etc. */}
        <FormField
          control={control}
          name="lapDetails.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location of the Property</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="Municipality">Municipality</SelectItem>
                  <SelectItem value="Gram Panchayat">Gram Panchayat</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* More Address Fields */}
        {[
          { name: "address", label: "Address" },
          { name: "landmark", label: "Landmark" },
          { name: "district", label: "District" },
          { name: "country", label: "Country" },
          { name: "city", label: "City" },
          { name: "state", label: "State" },
          { name: "pincode", label: "Pin Code" },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={control}
            name={`lapDetails.${name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={`Enter ${label}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* Source of Margin Money */}
        <FormField
          control={control}
          name="lapDetails.sourceOfMarginMoney"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source of Margin Money</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Own Savings">Own Savings</SelectItem>
                  <SelectItem value="From Friend & Relatives">From Friend & Relatives</SelectItem>
                  <SelectItem value="Realty Gold Loan">Realty Gold Loan</SelectItem>
                  <SelectItem value="Other Loan">Other Loan</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Collateral Details */}
        <h2 className="text-lg font-semibold mt-6">Collateral Details</h2>

        <FormField
          control={control}
          name="lapDetails.collateralType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collateral Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Collateral Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Term Deposit">Term Deposit</SelectItem>
                  <SelectItem value="NSC/KVP">NSC/KVP</SelectItem>
                  <SelectItem value="Life Insurance Policy">Life Insurance Policy</SelectItem>
                  <SelectItem value="Govt. Promissory Note">Govt. Promissory Note</SelectItem>
                  <SelectItem value="Immovable Property">Immovable Property</SelectItem>
                  <SelectItem value="Third Party Guarantee">Third Party Guarantee</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {[
          { name: "collateralOwner", label: "Collateral Owner" },
          { name: "collateralDescription", label: "Collateral Description" },
          { name: "collateralValue", label: "Collateral Value (₹)" },
          { name: "collateralLienValue", label: "Collateral Lien Value (₹)" },
          { name: "collateralAddress", label: "Collateral Address" },
        ].map(({ name, label }) => (
          <FormField
            key={name}
            control={control}
            name={`lapDetails.${name}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input placeholder={`Enter ${label}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  
          <FormField
            control={control}
            name="lapDetails.insuranceOptIn"
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
                name="lapDetails.insuranceScheme"
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
                  name="lapDetails.premiumAmount"
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
                  name="lapDetails.sumAssured"
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
                name="lapDetails.nominee"
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
                name="lapDetails.nomineeRelationship"
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
                name="lapDetails.referralFee"
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
                name="lapDetails.declarationDate"
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
