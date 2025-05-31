"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface KYCFormProps {
  onCancel: () => void;
  onCustomerCreated: (customer: any) => void;
}

export function KYCForm({ onCancel, onCustomerCreated }: KYCFormProps) {
  const { user } = useAuth();
  const { addCustomer, createApplication } = useDataStore();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: user?.pincode || "",
    aadharNumber: "",
    panNumber: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    pincode: "",
    aadharNumber: "",
    panNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      pincode: "",
      aadharNumber: "",
      panNumber: ""
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
      isValid = false;
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar number is required";
      isValid = false;
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar must be 12 digits";
      isValid = false;
    }

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = "PAN number is required";
      isValid = false;
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const customer = await addCustomer(formData);

      if (customer) {
        toast.success(`Customer created successfully. ID: ${customer.custId}`);
        onCustomerCreated(customer);
      }
    } catch (error) {
      toast.error("Failed to create customer");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 py-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="10 digit phone number"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            name="pincode"
            placeholder="6 digit pincode"
            value={formData.pincode}
            onChange={handleChange}
            className={errors.pincode ? "border-destructive" : ""}
          />
          {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="aadharNumber">Aadhar Number</Label>
          <Input
            id="aadharNumber"
            name="aadharNumber"
            placeholder="12 digit Aadhar number"
            value={formData.aadharNumber}
            onChange={handleChange}
            className={errors.aadharNumber ? "border-destructive" : ""}
          />
          {errors.aadharNumber && <p className="text-xs text-destructive">{errors.aadharNumber}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="panNumber">PAN Number</Label>
          <Input
            id="panNumber"
            name="panNumber"
            placeholder="10 character PAN number"
            value={formData.panNumber}
            onChange={handleChange}
            className={errors.panNumber ? "border-destructive" : ""}
          />
          {errors.panNumber && <p className="text-xs text-destructive">{errors.panNumber}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit">Submit KYC</Button>
      </div>
    </form>
  );
}