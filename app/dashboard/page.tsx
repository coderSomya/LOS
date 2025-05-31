"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppStatus, UserType } from "@/types";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, PieChart, TrendingUp, Users, FileCheck } from "lucide-react";
import ApplicationForm from "@/components/application/application-form";

export default function DashboardPage() {
  const { user } = useAuth();
  const { getApplicationsByPincode } = useDataStore();
  const router = useRouter();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    const apps = getApplicationsByPincode(user.pincode);
    setApplications(apps);
  }, [user, getApplicationsByPincode]);

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

  const countByStatus = (status: AppStatus) => {
    return applications.filter(app => app.status === status).length;
  };

  const pendingCount = countByStatus(AppStatus.FORM_SUBMITTED);
  const approvedCount = countByStatus(AppStatus.LOAN_APPROVED);
  const rejectedCount = countByStatus(AppStatus.LOAN_REJECTED);
  const draftCount = countByStatus(AppStatus.DRAFT);

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user?.userType === UserType.SALES_MAKER && (
          <Button 
            onClick={() => setShowApplicationForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Fill Form
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pending Applications</p>
                <p className="text-3xl font-bold">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Approved Loans</p>
                <p className="text-3xl font-bold">{approvedCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Rejected Applications</p>
                <p className="text-3xl font-bold">{rejectedCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <PieChart className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Customers</p>
                <p className="text-3xl font-bold">{applications.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Showing applications for your assigned pincode ({user?.pincode})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ApplicationsTable 
                applications={applications} 
                getStatusColor={getStatusColor}
                formatStatus={formatStatus}
                onViewApplication={(id) => router.push(`/applications/${id}`)}
              />
            </TabsContent>
            <TabsContent value="pending">
              <ApplicationsTable 
                applications={applications.filter(app => app.status === AppStatus.FORM_SUBMITTED)} 
                getStatusColor={getStatusColor}
                formatStatus={formatStatus}
                onViewApplication={(id) => router.push(`/applications/${id}`)}
              />
            </TabsContent>
            <TabsContent value="approved">
              <ApplicationsTable 
                applications={applications.filter(app => app.status === AppStatus.LOAN_APPROVED)} 
                getStatusColor={getStatusColor}
                formatStatus={formatStatus}
                onViewApplication={(id) => router.push(`/applications/${id}`)}
              />
            </TabsContent>
            <TabsContent value="rejected">
              <ApplicationsTable 
                applications={applications.filter(app => app.status === AppStatus.LOAN_REJECTED)} 
                getStatusColor={getStatusColor}
                formatStatus={formatStatus}
                onViewApplication={(id) => router.push(`/applications/${id}`)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showApplicationForm && (
        <ApplicationForm 
          open={showApplicationForm} 
          onClose={() => setShowApplicationForm(false)} 
          onSuccess={() => {
            setShowApplicationForm(false);
            // Refresh applications
            if (user) {
              const apps = getApplicationsByPincode(user.pincode);
              setApplications(apps);
            }
          }}
        />
      )}
    </MainLayout>
  );
}

function ApplicationsTable({ 
  applications, 
  getStatusColor, 
  formatStatus,
  onViewApplication
}) {
  return (
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
          {applications.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No applications found
              </TableCell>
            </TableRow>
          )}
          {applications.map((app) => (
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
                  <Badge variant="outline\" className="bg-green-100 text-green-800 border-green-200">
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewApplication(app.id)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}