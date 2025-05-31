"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { UserType, AppStatus, Application } from "@/types";
import ApplicationForm from "@/components/application/application-form";
import Link from "next/link";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const { getApplicationsByPincode } = useDataStore();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editApplication, setEditApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const apps = await getApplicationsByPincode(user.pincode);
      setApplications(apps);
      setFilteredApplications(apps);
    };

    fetchData();
  }, [user, getApplicationsByPincode]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApplications(applications);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = applications.filter(app => 
      app.leadId.toLowerCase().includes(term) || 
      app.appId?.toLowerCase().includes(term) || 
      app.tempAppId?.toLowerCase().includes(term) || 
      app.customer?.name.toLowerCase().includes(term) || 
      app.customer?.phone.toLowerCase().includes(term) || 
      app.customer?.custId.toLowerCase().includes(term)
    );

    setFilteredApplications(filtered);
  }, [searchTerm, applications]);

  const getStatusColor = (status: AppStatus) => {
    switch (status) {
      case AppStatus.DRAFT:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case AppStatus.FORM_SUBMITTED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case AppStatus.LOAN_APPROVED:
        return "bg-green-100 text-green-800 border-green-200";
      case AppStatus.LOAN_REJECTED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status: AppStatus) => {
    return status.replace("_", " ");
  };

  const handleRefreshData = async () => {
    if (!user) return;

    const apps = await getApplicationsByPincode(user.pincode);
    setApplications(apps);
    setFilteredApplications(apps);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditApplication(null);
    handleRefreshData();
  };

  const handleEdit = (application: Application) => {
    setEditApplication(application);
    setShowForm(true);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        {user?.userType === UserType.SALES_MAKER && (
          <Button onClick={() => setShowForm(true)}>New Application</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by lead ID, application ID, customer name, or phone..."
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
                  <TableHead>Lead ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>App ID</TableHead>
                  <TableHead>KYC Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.leadId}</TableCell>
                    <TableCell>
                      <div className="font-medium">{app.customer?.name || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{app.customer?.custId || ''}</div>
                    </TableCell>
                    <TableCell>{app.customer?.phone || 'N/A'}</TableCell>
                    <TableCell>{app.appId || app.tempAppId || 'N/A'}</TableCell>
                    <TableCell>
                      {app.customer?.kycVerified ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(app.status)}>
                        {formatStatus(app.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                          <Link
                            href={`/applications/${app.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                          {app.status === AppStatus.DRAFT && user?.userType === UserType.SALES_MAKER && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(app)}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showForm && (
        <ApplicationForm
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditApplication(null);
          }}
          onSuccess={handleSuccess}
          editApplication={editApplication}
        />
      )}
    </MainLayout>
  );
}