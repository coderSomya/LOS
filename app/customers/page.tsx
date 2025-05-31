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

export default function CustomersPage(): JSX.Element {
  const { user } = useAuth();
  const { getCustomersByPincode } = useDataStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Load customers when component mounts or user changes
  useEffect(() => {
    const loadCustomers = async () => {
      if (!user?.pincode) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const customersList = await getCustomersByPincode(user.pincode);
        setCustomers(customersList);
        setFilteredCustomers(customersList);
        setError("");
      } catch (err) {
        console.error("Error loading customers:", err);
        setError("Failed to load customers");
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, [user?.pincode, getCustomersByPincode]);

  // Filter customers based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(
      (cust) =>
        cust.name.toLowerCase().includes(term) ||
        cust.phone.toLowerCase().includes(term) ||
        cust.custId.toLowerCase().includes(term) ||
        cust.aadharNumber?.toLowerCase().includes(term) ||
        cust.panNumber?.toLowerCase().includes(term)
    );

    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Please log in to view customers.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="text-sm text-muted-foreground">
          Pincode: {user.pincode}
        </div>
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
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        <div className="flex items-center justify-center">
                          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                          Loading customers...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        {searchTerm.trim() ? "No customers found matching your search" : "No customers found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
}