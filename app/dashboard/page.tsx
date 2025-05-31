"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppStatus, UserType, Application } from "@/types";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, PieChart, TrendingUp, Users, FileCheck } from "lucide-react";
import ApplicationForm from "@/components/application/application-form";

export default function DashboardPage(): JSX.Element {
  const { user } = useAuth();
  const { getApplicationsByPincode } = useDataStore();
  const router = useRouter();
  const [showApplicationForm, setShowApplicationForm] = useState<boolean>(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Load applications when component mounts or user changes
  useEffect(() => {
    const loadApplications = async (): Promise<void> => {
      if (!user?.pincode) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Loading applications for pincode:", user.pincode);
        setIsLoading(true);
        const apps = await getApplicationsByPincode(user.pincode);
        setApplications(apps);
        setError("");
      } catch (err) {
        console.error("Error loading applications:", err);
        setError("Failed to load applications");
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [user?.pincode, getApplicationsByPincode]);

  // Refresh applications function
  const refreshApplications = async (): Promise<void> => {
    if (!user?.pincode) return;

    try {
      const apps = await getApplicationsByPincode(user.pincode);
      setApplications(apps);
    } catch (err) {
      console.error("Error refreshing applications:", err);
    }
  };

  // Handle application form success
  const handleApplicationFormSuccess = async (): Promise<void> => {
    setShowApplicationForm(false);
    await refreshApplications();
  };

  const getStatusColor = (status: AppStatus): string => {
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

  const formatStatus = (status: AppStatus): string => {
    return status.replace(/_/g, " ");
  };

  const countByStatus = (status: AppStatus): number => {
    return applications.filter(app => app.status === status).length;
  };

  const pendingCount = countByStatus(AppStatus.FORM_SUBMITTED);
  const approvedCount = countByStatus(AppStatus.LOAN_APPROVED);
  const rejectedCount = countByStatus(AppStatus.LOAN_REJECTED);
  const draftCount = countByStatus(AppStatus.DRAFT);

  // Get unique customers count
  const uniqueCustomersCount = new Set(
    applications.map(app => app.customer?.custId).filter(Boolean)
  ).size;

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Please log in to view the dashboard.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Pincode: {user.pincode}</p>
        </div>
        {user.userType === UserType.SALES_MAKER && (
          <Button 
            onClick={() => setShowApplicationForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Fill Form
          </Button>
        )}
      </div>

      {error ? (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={refreshApplications} variant="outline">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Pending Applications</p>
                    <p className="text-3xl font-bold">{isLoading ? "..." : pendingCount}</p>
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
                    <p className="text-3xl font-bold">{isLoading ? "..." : approvedCount}</p>
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
                    <p className="text-3xl font-bold">{isLoading ? "..." : rejectedCount}</p>
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
                    <p className="text-3xl font-bold">{isLoading ? "..." : uniqueCustomersCount}</p>
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
                Showing applications for your assigned pincode ({user.pincode})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                  <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ApplicationsTable 
                    applications={applications} 
                    getStatusColor={getStatusColor}
                    formatStatus={formatStatus}
                    onViewApplication={(id) => router.push(`/applications/${id}`)}
                    isLoading={isLoading}
                  />
                </TabsContent>
                <TabsContent value="pending">
                  <ApplicationsTable 
                    applications={applications.filter(app => app.status === AppStatus.FORM_SUBMITTED)} 
                    getStatusColor={getStatusColor}
                    formatStatus={formatStatus}
                    onViewApplication={(id) => router.push(`/applications/${id}`)}
                    isLoading={isLoading}
                  />
                </TabsContent>
                <TabsContent value="approved">
                  <ApplicationsTable 
                    applications={applications.filter(app => app.status === AppStatus.LOAN_APPROVED)} 
                    getStatusColor={getStatusColor}
                    formatStatus={formatStatus}
                    onViewApplication={(id) => router.push(`/applications/${id}`)}
                    isLoading={isLoading}
                  />
                </TabsContent>
                <TabsContent value="rejected">
                  <ApplicationsTable 
                    applications={applications.filter(app => app.status === AppStatus.LOAN_REJECTED)} 
                    getStatusColor={getStatusColor}
                    formatStatus={formatStatus}
                    onViewApplication={(id) => router.push(`/applications/${id}`)}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {showApplicationForm && (
        <ApplicationForm 
          open={showApplicationForm} 
          onClose={() => setShowApplicationForm(false)} 
          onSuccess={handleApplicationFormSuccess}
        />
      )}
    </MainLayout>
  );
}

interface ApplicationsTableProps {
  applications: Application[];
  getStatusColor: (status: AppStatus) => string;
  formatStatus: (status: AppStatus) => string;
  onViewApplication: (id: string) => void;
  isLoading: boolean;
}

function ApplicationsTable({
  applications,
  getStatusColor,
  formatStatus,
  onViewApplication,
  isLoading,
}: ApplicationsTableProps): JSX.Element {
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                  Loading applications...
                </div>
              </TableCell>
            </TableRow>
          ) : applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewApplication(app.id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}