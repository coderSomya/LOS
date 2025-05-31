"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Customer } from "@/types";

export default function CustomersPage() {
  const { user } = useAuth();
  const { customers } = useDataStore();
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Filter customers by user's pincode
    if (user) {
      const customersByPincode = customers.filter(
        (cust) => cust.pincode === user.pincode
      );
      setFilteredCustomers(customersByPincode);
    }
  }, [customers, user]);

  useEffect(() => {
    if (!user) return;
    
    const customersByPincode = customers.filter(
      (cust) => cust.pincode === user.pincode
    );
    
    if (!searchTerm.trim()) {
      setFilteredCustomers(customersByPincode);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = customersByPincode.filter(
      (cust) =>
        cust.name.toLowerCase().includes(term) ||
        cust.phone.toLowerCase().includes(term) ||
        cust.custId.toLowerCase().includes(term) ||
        cust.aadharNumber?.toLowerCase().includes(term) ||
        cust.panNumber?.toLowerCase().includes(term)
    );

    setFilteredCustomers(filtered);
  }, [searchTerm, customers, user]);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, customer ID, Aadhar, or PAN..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Aadhar Number</TableHead>
                  <TableHead>PAN Number</TableHead>
                  <TableHead>KYC Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.custId}
                    </TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.pincode}</TableCell>
                    <TableCell>{customer.aadharNumber || "N/A"}</TableCell>
                    <TableCell>{customer.panNumber || "N/A"}</TableCell>
                    <TableCell>
                      {customer.kycVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-200"
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}