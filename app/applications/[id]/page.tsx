"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { useAuth } from "@/lib/auth";
import { useDataStore } from "@/lib/data";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AppStatus, UserType, ActionType, LoanType } from "@/types";
import { toast } from "sonner";
import { formatDistance } from "date-fns";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    getApplicationById, 
    getActivitiesByApplicationId, 
    updateCustomerKyc,
    approveApplication,
    rejectApplication 
  } = useDataStore();
  
  const [application, setApplication] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [comment, setComment] = useState("");
  
  const id = params?.id;
  
  useEffect(() => {
    if (!id) return;
    
    const app = getApplicationById(id as string);
    setApplication(app);
    
    const logs = getActivitiesByApplicationId(id as string);
    setActivities(logs);
  }, [id, getApplicationById, getActivitiesByApplicationId]);
  
  if (!application) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading application...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
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
  
  const formatLoanType = (type: LoanType) => {
    return type.replace("_", " ");
  };
  
  const handleKycToggle = (checked: boolean) => {
    if (!user || !application.customer?.custId) return;
    
    const success = updateCustomerKyc(
      application.customer.custId,
      checked,
      user.id
    );
    
    if (success) {
      toast.success(`KYC verification ${checked ? "approved" : "revoked"}`);
      
      // Refresh application data
      const app = getApplicationById(id as string);
      setApplication(app);
      
      // Refresh activity logs
      const logs = getActivitiesByApplicationId(id as string);
      setActivities(logs);
    } else {
      toast.error("Failed to update KYC status");
    }
  };
  
  const handleApprove = () => {
    if (!user || !id || !comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    const result = approveApplication(id as string, user.id, comment);
    
    if (result) {
      toast.success("Application approved successfully");
      setShowApproveDialog(false);
      
      // Refresh application data
      const app = getApplicationById(id as string);
      setApplication(app);
      
      // Refresh activity logs
      const logs = getActivitiesByApplicationId(id as string);
      setActivities(logs);
    } else {
      toast.error("Failed to approve application. KYC must be verified first.");
    }
  };
  
  const handleReject = () => {
    if (!user || !id || !comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    
    const result = rejectApplication(id as string, user.id, comment);
    
    if (result) {
      toast.success("Application rejected successfully");
      setShowRejectDialog(false);
      
      // Refresh application data
      const app = getApplicationById(id as string);
      setApplication(app);
      
      // Refresh activity logs
      const logs = getActivitiesByApplicationId(id as string);
      setActivities(logs);
    } else {
      toast.error("Failed to reject application");
    }
  };
  
  const formatActivityType = (type: ActionType) => {
    switch (type) {
      case ActionType.CREATED:
        return "Created";
      case ActionType.SAVED:
        return "Saved";
      case ActionType.SUBMITTED:
        return "Submitted";
      case ActionType.APPROVED:
        return "Approved";
      case ActionType.REJECTED:
        return "Rejected";
      case ActionType.KYC_VERIFIED:
        return "KYC Verified";
      default:
        return type;
    }
  };
  
  const getActivityIcon = (type: ActionType) => {
    switch (type) {
      case ActionType.CREATED:
        return "bg-blue-100 text-blue-800";
      case ActionType.SAVED:
        return "bg-purple-100 text-purple-800";
      case ActionType.SUBMITTED:
        return "bg-amber-100 text-amber-800";
      case ActionType.APPROVED:
        return "bg-green-100 text-green-800";
      case ActionType.REJECTED:
        return "bg-red-100 text-red-800";
      case ActionType.KYC_VERIFIED:
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            Application Details
            <Badge variant="outline" className={getStatusColor(application.status)}>
              {formatStatus(application.status)}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Lead ID: {application.leadId} | 
            {application.appId ? ` Application ID: ${application.appId}` : application.tempAppId ? ` Temp ID: ${application.tempAppId}` : " No ID assigned yet"}
          </p>
        </div>
        
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Application Details</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                    <CardDescription>
                      Customer ID: {application.customer?.custId || "N/A"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        <p className="font-medium">{application.customer?.name || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{application.customer?.phone || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Pincode</Label>
                        <p className="font-medium">{application.customer?.pincode || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">KYC Status</Label>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={application.customer?.kycVerified 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : "bg-amber-100 text-amber-800 border-amber-200"
                          }>
                            {application.customer?.kycVerified ? "Verified" : "Pending"}
                          </Badge>
                          
                          {user?.userType === UserType.SALES_CHECKER && (
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={application.customer?.kycVerified || false}
                                onCheckedChange={handleKycToggle}
                                id="kyc-verified"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Aadhar Number</Label>
                        <p className="font-medium">{application.customer?.aadharNumber || "N/A"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">PAN Number</Label>
                        <p className="font-medium">{application.customer?.panNumber || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Information</CardTitle>
                    <CardDescription>
                      Loan Type: {formatLoanType(application.loanType)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {application.formData ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Loan Amount</Label>
                          <p className="font-medium">₹{application.formData.loanAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Monthly Income</Label>
                          <p className="font-medium">₹{application.formData.monthlyIncome.toLocaleString()}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Employment Status</Label>
                          <p className="font-medium">{application.formData.employmentStatus.replace("_", " ")}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Existing Loans</Label>
                          <p className="font-medium">{application.formData.existingLoans ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Lead Source</Label>
                          <p className="font-medium">{application.formData.leadSource.replace("_", " ")}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-muted-foreground">Loan Purpose</Label>
                          <p className="font-medium">{application.formData.loanPurpose}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No form data available</p>
                    )}
                  </CardContent>
                  {user?.userType === UserType.SALES_CHECKER && 
                   application.status === AppStatus.FORM_SUBMITTED && (
                    <CardFooter className="flex justify-end gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={() => setShowRejectDialog(true)}
                      >
                        Reject
                      </Button>
                      <Button 
                        onClick={() => setShowApproveDialog(true)}
                      >
                        Approve
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center">No activity recorded</p>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 pb-4 border-b">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityIcon(activity.actionType)}`}>
                            {activity.actionType.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{formatActivityType(activity.actionType)}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatDistance(new Date(activity.performedAt), new Date(), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Application Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Application Status</Label>
                  <p className="font-medium">{formatStatus(application.status)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Loan Type</Label>
                  <p className="font-medium">{formatLoanType(application.loanType)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">{application.customer?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created Date</Label>
                  <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">{new Date(application.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Enter reason for approval"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Reason for Rejection</Label>
              <Textarea
                id="comment"
                placeholder="Enter reason for rejection"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}