import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const applicationStatus = {
    step: 3,
    totalSteps: 5,
    status: "under-review",
    submittedDate: "2024-01-15",
    lastUpdate: "2024-01-18"
  };

  const documents = [
    { name: "Company Registration Certificate", status: "verified", uploadedDate: "2024-01-15" },
    { name: "Founder ID Proof", status: "verified", uploadedDate: "2024-01-15" },
    { name: "Business Plan", status: "pending", uploadedDate: "2024-01-15" },
    { name: "Financial Statements", status: "required", uploadedDate: null },
  ];

  const activities = [
    { type: "status-update", message: "Application moved to review stage", date: "2024-01-18", time: "10:30 AM" },
    { type: "document-upload", message: "Business plan uploaded successfully", date: "2024-01-16", time: "2:15 PM" },
    { type: "application-submit", message: "Application submitted for review", date: "2024-01-15", time: "4:45 PM" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "required": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case "pending": return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case "required": return <Badge className="bg-red-100 text-red-800">Required</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-ayush-light to-background">
      <div className="container max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Startup Dashboard</h1>
              <p className="text-muted-foreground">Manage your AYUSH startup registration</p>
            </div>
            <Badge variant="outline" className="text-sm">
              Application ID: AYU-2024-001234
            </Badge>
          </div>

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
                    Submitted on {applicationStatus.submittedDate} • Last updated {applicationStatus.lastUpdate}
                  </CardDescription>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{applicationStatus.step} of {applicationStatus.totalSteps} steps completed</span>
                </div>
                <Progress value={(applicationStatus.step / applicationStatus.totalSteps) * 100} className="h-2" />
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-ayush-green mx-auto mb-1"></div>
                    <span>Submitted</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-ayush-green mx-auto mb-1"></div>
                    <span>Verified</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1"></div>
                    <span>Review</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mx-auto mb-1"></div>
                    <span>Approval</span>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mx-auto mb-1"></div>
                    <span>Certificate</span>
                  </div>
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
                    <div className="text-2xl font-bold">Under Review</div>
                    <p className="text-xs text-muted-foreground">Expected completion: 7-10 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3/4</div>
                    <p className="text-xs text-muted-foreground">Documents verified</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Action</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Upload</div>
                    <p className="text-xs text-muted-foreground">Financial statements required</p>
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
                        <p className="text-sm">AyurTech Innovations Pvt Ltd</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">AYUSH Category</span>
                        <p className="text-sm">Ayurveda</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Founded Year</span>
                        <p className="text-sm">2024</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Founder</span>
                        <p className="text-sm">Dr. Priya Sharma</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Business Model</span>
                        <p className="text-sm">B2C (Business to Consumer)</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Location</span>
                        <p className="text-sm">Mumbai, Maharashtra</p>
                      </div>
                    </div>
                  </div>
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
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(doc.status)}`}></div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.uploadedDate ? `Uploaded on ${doc.uploadedDate}` : "Not uploaded"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(doc.status)}
                          {doc.status === "verified" && (
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                          {doc.status === "required" && (
                            <Button size="sm">
                              Upload
                            </Button>
                          )}
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
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                        <div className="w-2 h-2 rounded-full bg-ayush-green mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.date} at {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your account and company details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Founder Details</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Name</span>
                          <p className="text-sm">Dr. Priya Sharma</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Email</span>
                          <p className="text-sm">priya@ayurtech.com</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Phone</span>
                          <p className="text-sm">+91 98765 43210</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Qualification</span>
                          <p className="text-sm">BAMS (Bachelor of Ayurvedic Medicine)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Company Details</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Business Description</span>
                          <p className="text-sm">AI-powered personalized Ayurvedic treatment recommendations and herbal product delivery platform.</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Target Market</span>
                          <p className="text-sm">Health-conscious individuals seeking natural wellness solutions, aged 25-55 years.</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Funding Stage</span>
                          <p className="text-sm">Pre-Seed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t flex space-x-4">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
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