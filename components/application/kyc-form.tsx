"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, FileImage } from "lucide-react";

interface KYCFormProps {
  onCancel: () => void;
  onCustomerCreated: (customer: any) => void;
}

export function KYCForm({ onCancel, onCustomerCreated }: KYCFormProps) {
  const { user } = useAuth();
  const { addCustomer, createApplication } = useDataStore();
  const aadharFileRef = useRef<HTMLInputElement>(null);
  const panFileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: user?.pincode || "",
    aadharNumber: "",
    panNumber: ""
  });

  const [files, setFiles] = useState({
    aadharImage: null as File | null,
    panImage: null as File | null
  });

  const [previews, setPreviews] = useState({
    aadharImage: "",
    panImage: ""
  });

  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    pincode: "",
    aadharNumber: "",
    panNumber: "",
    aadharImage: "",
    panImage: ""
  });

  const handleChange = (e: any) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadharImage' | 'panImage') => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [type]: "Please select an image file"
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: "File size should not exceed 5MB"
        }));
        return;
      }

      setFiles(prev => ({
        ...prev,
        [type]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [type]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);

      // Clear error
      setErrors(prev => ({
        ...prev,
        [type]: ""
      }));
    }
  };

  const removeFile = (type: 'aadharImage' | 'panImage') => {
    setFiles(prev => ({
      ...prev,
      [type]: null
    }));
    setPreviews(prev => ({
      ...prev,
      [type]: ""
    }));

    // Reset file input
    if (type === 'aadharImage' && aadharFileRef.current) {
      aadharFileRef.current.value = '';
    }
    if (type === 'panImage' && panFileRef.current) {
      panFileRef.current.value = '';
    }
  };

  const uploadFiles = async (aadharNumber: string) => {
    if (!files.aadharImage || !files.panImage) {
      throw new Error("Both Aadhar and PAN images are required");
    }

    const formData = new FormData();
    formData.append('aadharImage', files.aadharImage);
    formData.append('panImage', files.panImage);
    formData.append('aadharNumber', aadharNumber);

    const response = await fetch('/api/upload-kyc', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return await response.json();
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      phone: "",
      pincode: "",
      aadharNumber: "",
      panNumber: "",
      aadharImage: "",
      panImage: ""
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

    if (!files.aadharImage) {
      newErrors.aadharImage = "Aadhar card image is required";
      isValid = false;
    }

    if (!files.panImage) {
      newErrors.panImage = "PAN card image is required";
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

    setIsUploading(true);

    try {
      // First upload the files
      await uploadFiles(formData.aadharNumber);

      // Then create the customer
      const customer = await addCustomer(formData);

      if (customer) {
        toast.success(`Customer created successfully. ID: ${customer.custId}`);
        onCustomerCreated(customer);
      }
    } catch (error) {
      toast.error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);
    } finally {
      setIsUploading(false);
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

      {/* File Upload Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Aadhar Image Upload */}
        <div className="grid gap-2">
          <Label>Aadhar Card Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {previews.aadharImage ? (
              <div className="relative">
                <img 
                  src={previews.aadharImage} 
                  alt="Aadhar preview" 
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeFile('aadharImage')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => aadharFileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Aadhar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={aadharFileRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'aadharImage')}
            className="hidden"
          />
          {errors.aadharImage && <p className="text-xs text-destructive">{errors.aadharImage}</p>}
        </div>

        {/* PAN Image Upload */}
        <div className="grid gap-2">
          <Label>PAN Card Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {previews.panImage ? (
              <div className="relative">
                <img 
                  src={previews.panImage} 
                  alt="PAN preview" 
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeFile('panImage')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => panFileRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PAN
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={panFileRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'panImage')}
            className="hidden"
          />
          {errors.panImage && <p className="text-xs text-destructive">{errors.panImage}</p>}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Submit KYC"}
        </Button>
      </div>
    </form>
  );
}