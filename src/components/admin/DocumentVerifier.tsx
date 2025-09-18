import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Eye, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface PendingDocument {
  id: string;
  name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  verification_status: string;
  file_path: string;
  applications: {
    id: string;
    company_name: string;
    application_id: string;
    ayush_category: string;
    profiles: {
      full_name: string;
      email: string;
    };
  };
}

export default function DocumentVerifier() {
  const [documents, setDocuments] = useState<PendingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<PendingDocument | null>(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('document-verifier', {
        method: 'GET',
        body: new URLSearchParams({ action: 'pending' })
      });

      if (error) throw error;

      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching pending documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (documentId: string, status: 'approved' | 'rejected' | 'under_review') => {
    try {
      setVerifying(true);
      const { data, error } = await supabase.functions.invoke('document-verifier', {
        body: {
          documentId,
          status,
          notes: verificationNotes
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message,
      });

      // Refresh the list
      await fetchPendingDocuments();
      setSelectedDoc(null);
      setVerificationNotes("");

    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        title: "Error",
        description: "Failed to verify document",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const getFileUrl = (filePath: string) => {
    return supabase.storage.from('documents').getPublicUrl(filePath).data.publicUrl;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'under_review':
        return <Badge variant="outline"><Eye className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Verification</h2>
          <p className="text-muted-foreground">Review and verify uploaded documents</p>
        </div>
        <Button onClick={fetchPendingDocuments} variant="outline">
          Refresh
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No pending documents</p>
              <p className="text-muted-foreground">All documents have been reviewed</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription>
                      {doc.applications.company_name} ({doc.applications.application_id})
                    </CardDescription>
                  </div>
                  {getStatusBadge(doc.verification_status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Applicant</p>
                    <p className="text-sm text-muted-foreground">{doc.applications.profiles.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">{doc.applications.ayush_category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File Size</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(doc.file_size)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getFileUrl(doc.file_path), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Verify Document</DialogTitle>
                        <DialogDescription>
                          Review and verify: {doc.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Verification Notes</label>
                          <Textarea
                            value={verificationNotes}
                            onChange={(e) => setVerificationNotes(e.target.value)}
                            placeholder="Add notes about your verification decision..."
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleVerification(doc.id, 'approved')}
                            disabled={verifying}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleVerification(doc.id, 'under_review')}
                            disabled={verifying}
                            variant="outline"
                            className="flex-1"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                          <Button
                            onClick={() => handleVerification(doc.id, 'rejected')}
                            disabled={verifying}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}