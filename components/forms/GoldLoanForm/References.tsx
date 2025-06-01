'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MinusCircle, Plus } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';

interface ReferenceFormProps {
  control: Control<any>;
}

export function References({ control }: ReferenceFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'references',
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="border border-gray-300 p-4 rounded-xl relative space-y-4">
          <FormField
            control={control}
            name={`references.${index}.name`}
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
            name={`references.${index}.address`}
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
            name={`references.${index}.mobile`}
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
            name={`references.${index}.email`}
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
            name={`references.${index}.relationship`}
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
  );
}
