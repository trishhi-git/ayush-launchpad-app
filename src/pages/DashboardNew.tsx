import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useApplicationData } from "@/hooks/useApplicationData";
import ApplicationForm from "@/components/ApplicationForm";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { StorageTest } from "@/components/StorageTest";
import DocumentStatus from "@/components/DocumentStatus";
import { useToast } from "@/hooks/use-toast";

export default function DashboardNew() {
  const { user, signOut } = useAuth();
  const { application, documents, activities, profile, loading, updateProfile, uploadDocument, refetch } = useApplicationData();
  const { toast } = useToast();
  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
    qualification: "",
  });

  // Initialize profile form when profile loads
  useState(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        qualification: profile.qualification || "",
      });
    }
  });

  const getVerificationStatusColor = (verificationStatus: string) => {
    switch (verificationStatus) {
      case "approved": return "bg-green-500";
      case "under_review": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getApplicationStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "under-review": return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case "submitted": return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case "draft": return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "rejected": return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleFileUpload = async (file: File, documentId: string) => {
    console.log('Starting file upload:', { fileName: file.name, fileSize: file.size, documentId });
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const success = await uploadDocument(file, documentId);
    console.log('Upload result:', success);
  };

  const handleFileSelect = (documentId: string) => {
    const input = fileInputRefs.current[documentId];
    if (input) {
      input.click();
    }
  };

  const handleProfileUpdate = async () => {
    await updateProfile(profileForm);
    setEditingProfile(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Clock className="h-8 w-8 animate-spin text-ayush-green" />
      </div>
    );
  }

  // Show application form if no application exists
  if (!application) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-ayush-light to-background">
        <div className="container max-w-4xl">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || user?.email}!</h1>
              <p className="text-muted-foreground">Let's get your AYUSH startup registered</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <ApplicationForm onComplete={refetch} />
        </div>
      </div>
    );
  }

  const approvedDocuments = documents.filter(doc => doc.verification_status === "approved").length;
  const pendingDocuments = documents.filter(doc => !doc.file_path || doc.verification_status === "pending" || doc.verification_status === "under_review");
  const rejectedDocuments = documents.filter(doc => doc.verification_status === "rejected");
  const uploadedDocuments = documents.filter(doc => doc.file_path).length;
  
  // Calculate actual progress based on application state
  const calculateProgress = () => {
    const steps = [
      { name: "Application Created", completed: true }, // Always true if we have an application
      { name: "Profile Completed", completed: profile?.full_name && profile?.phone },
      { name: "Documents Uploaded", completed: uploadedDocuments === documents.length },
      { name: "Documents Verified", completed: approvedDocuments === documents.length },
      { name: "Application Approved", completed: application.status === "approved" }
    ];
    
    const completedSteps = steps.filter(step => step.completed).length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    
    return { steps, completedSteps, totalSteps, progressPercentage };
  };
  
  const { steps, completedSteps, totalSteps, progressPercentage } = calculateProgress();

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-ayush-light to-background">
      <div className="container max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Startup Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Application ID: {application.application_id}
              </Badge>
              <StorageTest />
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Certificate Card - Show if approved */}
          {application.status === "approved" && (
            <CertificateGenerator application={application} />
          )}

          {/* Application Status Card */}
          <Card className="border-ayush-green/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-ayush-green" />
                    Application Status
                  </CardTitle>
                  <CardDescription>
                    Created on {formatDate(application.created_at)}
                    {application.submitted_at && ` • Submitted ${formatDate(application.submitted_at)}`}
                  </CardDescription>
                </div>
                {getApplicationStatusBadge(application.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{completedSteps} of {totalSteps} steps completed</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {steps.map((step, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                        step.completed ? 'bg-primary' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-[10px] leading-tight">{step.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
                
                {/* Detailed Progress Steps */}
                <div className="mt-4 space-y-2">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center space-x-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        step.completed ? 'bg-primary' : 'bg-gray-300'
                      }`}></div>
                      <span className={step.completed ? 'text-foreground' : 'text-muted-foreground'}>
                        {step.name}
                      </span>
                      {step.completed && <CheckCircle className="h-4 w-4 text-primary ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Application Status</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">{application.status.replace('-', ' ')}</div>
                    <p className="text-xs text-muted-foreground">
                      {application.status === 'approved' ? 'Congratulations! Your application is approved.' :
                       application.status === 'under-review' ? 'Under admin review. Expected completion: 7-10 days' :
                       approvedDocuments === documents.length ? 'All documents approved. Awaiting final review.' :
                       uploadedDocuments === documents.length ? 'All documents uploaded. Awaiting verification.' :
                       'Upload all required documents to proceed.'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{approvedDocuments}/{documents.length}</div>
                    <p className="text-xs text-muted-foreground">Documents approved</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Action</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {application.status === 'approved' ? 'Complete' :
                       rejectedDocuments.length > 0 ? 'Fix' : 
                       pendingDocuments.length > 0 ? 'Upload' : 
                       approvedDocuments === documents.length ? 'Wait' : 'Review'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {application.status === 'approved' ? 'Application process completed' :
                       rejectedDocuments.length > 0 
                        ? `${rejectedDocuments.length} documents need correction`
                        : pendingDocuments.length > 0 
                        ? `${pendingDocuments.length} documents pending upload`
                        : approvedDocuments === documents.length
                        ? 'Awaiting final approval'
                        : 'Documents under review'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Your registered startup details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Company Name</span>
                        <p className="text-sm">{application.company_name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">AYUSH Category</span>
                        <p className="text-sm">{application.ayush_category}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Founded Year</span>
                        <p className="text-sm">{application.founded_year}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Business Model</span>
                        <p className="text-sm">{application.business_model}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Location</span>
                        <p className="text-sm">{application.location}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Funding Stage</span>
                        <p className="text-sm">{application.funding_stage || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  {application.business_description && (
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm font-medium text-muted-foreground">Business Description</span>
                      <p className="text-sm mt-1">{application.business_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Verification</CardTitle>
                  <CardDescription>Upload and manage your registration documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getVerificationStatusColor(doc.verification_status || 'pending')}`}></div>
                            <DocumentStatus document={doc} />
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.verification_status === "approved" && doc.file_path && (
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            )}
                            {doc.file_path && doc.verification_status !== "approved" && (
                              <Button 
                                size="sm" 
                                onClick={() => handleFileSelect(doc.id)}
                                variant={doc.verification_status === "rejected" ? "destructive" : "outline"}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Replace
                              </Button>
                            )}
                            {!doc.file_path && (
                              <Button 
                                size="sm" 
                                onClick={() => handleFileSelect(doc.id)}
                              >
                                <Upload className="h-4 w-4 mr-1" />
                                Upload
                              </Button>
                            )}
                            <input
                              ref={(el) => fileInputRefs.current[doc.id] = el}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, doc.id);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Track your application progress and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                          <div className="w-2 h-2 rounded-full bg-ayush-green mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(activity.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No activity yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your account and personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {editingProfile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                              id="full_name"
                              value={profileForm.full_name}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="qualification">Qualification</Label>
                          <Textarea
                            id="qualification"
                            value={profileForm.qualification}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, qualification: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setEditingProfile(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold">Personal Details</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Name</span>
                              <p className="text-sm">{profile?.full_name || 'Not provided'}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Email</span>
                              <p className="text-sm">{profile?.email || user?.email}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Phone</span>
                              <p className="text-sm">{profile?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Qualification</span>
                              <p className="text-sm">{profile?.qualification || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold">Application Details</h4>
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Application ID</span>
                              <p className="text-sm">{application.application_id}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Company</span>
                              <p className="text-sm">{application.company_name}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-muted-foreground">Status</span>
                              <p className="text-sm capitalize">{application.status.replace('-', ' ')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!editingProfile && (
                      <div className="pt-6 border-t flex space-x-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingProfile(true)}
                        >
                          Edit Profile
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}