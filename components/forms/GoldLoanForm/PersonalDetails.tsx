// components/forms/GoldLoanForm/PersonalDetails.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Control , useFieldArray} from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useWatch } from 'react-hook-form';
import { MinusCircle, Plus } from 'lucide-react';

interface PersonalDetailsProps {
  control: Control<any>;
}

export function PersonalDetails({ control }: PersonalDetailsProps) {
   const sameAsPermanent = useWatch({
    control,
    name: 'personalDetails.sameAsPermanent',
  });
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'personalDetails',
    });
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="personalDetails.firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter First Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.middleName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Middle Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Middle Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter Last Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.aadhar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aadhar/UID Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter Aadhar/UID" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.voterId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voter ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter Voter ID" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.mobile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile</FormLabel>
            <FormControl>
              <Input placeholder="Enter Mobile Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter Email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.spouseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of Spouse</FormLabel>
            <FormControl>
              <Input placeholder="Enter Spouse Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.fatherName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name of Father</FormLabel>
            <FormControl>
              <Input placeholder="Enter Father's Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Third Gender">Third Gender</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.maritalStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marital Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widow">Widow</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.religion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Religion</FormLabel>
            <FormControl>
              <Input placeholder="Enter Religion" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.education"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education</FormLabel>
            <FormControl>
              <Input placeholder="Enter Education Details" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.pan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PAN</FormLabel>
            <FormControl>
              <Input placeholder="Enter PAN Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.residentialStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residential Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Residential Status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Resident Indian (RI)">Resident Indian (RI)</SelectItem>
                <SelectItem value="Non-Resident Indian (NRI)">Non-Resident Indian (NRI)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.visaNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>VISA Number (if NRI)</FormLabel>
            <FormControl>
              <Input placeholder="Enter VISA Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="personalDetails.visaIssueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>VISA Issue Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? format(field.value, 'yyyy-MM-dd') : 'Select date'}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <div className="space-y-6">
          {/* Current Address */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Address</h3>
    
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="personalDetails.currentAddress"
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
                name="personalDetails.currentLandmark"
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
                name="personalDetails.currentCity"
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
                name="personalDetails.currentDistrict"
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
                name="personalDetails.currentState"
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
                name="personalDetails.currentPincode"
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
                name="personalDetails.currentCountry"
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
                name="personalDetails.currentResidingInMonths"
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
                name="personalDetails.currentResidentialType"
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
            name="personalDetails.sameAsPermanent"
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
                  name="personalDetails.permanentAddress"
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
                    name={`personalDetails.${name}`}
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
                  name="personalDetails.permanentResidentialType"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Applicant Role */}
      <FormField
        control={control}
        name="personalDetails.applicantRole"
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
        name="personalDetails.occupationType"
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
        name="personalDetails.employerName"
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
        name="personalDetails.employerAddress"
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
        name="personalDetails.employerPin"
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
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-300 p-4 rounded-xl relative space-y-4">
          <FormField
            control={control}
            name={`personalDetails.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`personalDetails.${index}.address`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`personalDetails.${index}.mobile`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`personalDetails.${index}.email`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`personalDetails.${index}.relationship`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <FormControl>
                  <Input placeholder="Enter relationship" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            className="absolute top-3 right-3 text-red-600 hover:bg-transparent"
            onClick={() => remove(index)}
          >
            <MinusCircle className="w-5 h-5" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append({})}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Reference
      </Button>
    </div>
      </>
  );
}
