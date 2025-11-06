import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, Eye, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  application_id: string;
  company_name: string;
  ayush_category: string;
  location: string;
  business_description: string;
  status: string;
  submitted_at: string;
  documents: Array<{
    id: string;
    name: string;
    verification_status: string;
    file_path?: string;
  }>;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export function ApplicationManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          documents(id, name, verification_status, file_path),
          profiles(full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        })
        .eq("id", applicationId);

      if (error) throw error;

      // Log approval activity
      await supabase
        .from("activity_logs")
        .insert({
          application_id: applicationId,
          type: "application-approved",
          message: "Application approved by admin",
          created_by: user?.id,
        });

      toast({
        title: "Application Approved",
        description: "The startup application has been approved and certificate can now be generated.",
      });

      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive",
      });
    }
  };

  const rejectApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          rejected_at: new Date().toISOString(),
          rejected_by: user?.id,
        })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: "The startup application has been rejected.",
      });

      fetchApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "under_review":
        return <Badge variant="secondary">Under Review</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const canApprove = (app: Application) => {
    return app.documents.every(doc => doc.verification_status === "approved");
  };

  const viewDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      if (error) throw error;
      
      if (data?.publicUrl) {
        window.open(data.publicUrl, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Document not accessible",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading applications...</div>;

  const pendingApps = applications.filter(app => app.status !== "approved" && app.status !== "rejected");
  const approvedApps = applications.filter(app => app.status === "approved");
  const rejectedApps = applications.filter(app => app.status === "rejected");

  return (
    <Tabs defaultValue="pending" className="space-y-6">
      <TabsList>
        <TabsTrigger value="pending">Pending ({pendingApps.length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({approvedApps.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejectedApps.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <div className="grid gap-4">
          {pendingApps.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{app.company_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {app.application_id} • {app.ayush_category} • {app.location}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">{app.business_description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {app.documents.map((doc) => (
                      <Badge
                        key={doc.id}
                        variant={doc.verification_status === "approved" ? "default" : "outline"}
                        className={doc.verification_status === "approved" ? "bg-green-100 text-green-800" : ""}
                      >
                        {doc.name}: {doc.verification_status}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{app.company_name} - Application Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong>Application ID:</strong> {app.application_id}
                            </div>
                            <div>
                              <strong>Category:</strong> {app.ayush_category}
                            </div>
                            <div>
                              <strong>Location:</strong> {app.location}
                            </div>
                            <div>
                              <strong>Submitted:</strong> {new Date(app.submitted_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <strong>Business Description:</strong>
                            <p className="mt-1 text-sm">{app.business_description}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {canApprove(app) && (
                      <Button
                        onClick={() => approveApplication(app.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    )}

                    <Button
                      onClick={() => rejectApplication(app.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>

                  {!canApprove(app) && (
                    <p className="text-sm text-amber-600">
                      ⚠️ All documents must be approved before the application can be approved
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="approved">
        <div className="grid gap-4">
          {approvedApps.map((app) => (
            <Card key={app.id} className="border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {app.company_name}
                      <Award className="h-5 w-5 text-green-600" />
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {app.application_id} • {app.ayush_category} • {app.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      👤 {app.profiles?.full_name} • 📧 {app.profiles?.email}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-green-600">
                    ✅ Approved and ready for certificate generation
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Approved Documents:</h4>
                    {app.documents.filter(doc => doc.verification_status === 'approved').map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span className="text-sm">{doc.name}</span>
                        {doc.file_path && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewDocument(doc.file_path!)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rejected">
        <div className="grid gap-4">
          {rejectedApps.map((app) => (
            <Card key={app.id} className="border-red-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{app.company_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {app.application_id} • {app.ayush_category} • {app.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      👤 {app.profiles?.full_name} • 📧 {app.profiles?.email}
                    </p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Documents:</h4>
                  {app.documents.map((doc) => (
                    <div key={doc.id} className={`flex items-center justify-between p-2 rounded ${
                      doc.verification_status === 'approved' ? 'bg-green-50' : 
                      doc.verification_status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'
                    }`}>
                      <div>
                        <span className="text-sm">{doc.name}</span>
                        <Badge className={`ml-2 text-xs ${
                          doc.verification_status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.verification_status}
                        </Badge>
                      </div>
                      {doc.file_path && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewDocument(doc.file_path!)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}