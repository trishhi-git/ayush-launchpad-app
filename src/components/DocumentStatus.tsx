import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Eye, AlertCircle } from "lucide-react";
import { Document } from "@/hooks/useApplicationData";

interface DocumentStatusProps {
  document: Document;
}

export default function DocumentStatus({ document }: DocumentStatusProps) {
  const getStatusDisplay = () => {
    if (!document.file_path) {
      return {
        badge: <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" />Not Uploaded</Badge>,
        message: "Please upload this document",
        color: "text-orange-600"
      };
    }

    switch (document.verification_status) {
      case 'approved':
        return {
          badge: <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>,
          message: document.verification_notes || "Document has been approved",
          color: "text-green-600"
        };
      case 'rejected':
        return {
          badge: <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>,
          message: document.verification_notes || "Document was rejected. Please re-upload with corrections.",
          color: "text-red-600"
        };
      case 'under_review':
        return {
          badge: <Badge variant="outline"><Eye className="w-3 h-3 mr-1" />Under Review</Badge>,
          message: "Document is being reviewed by admin",
          color: "text-blue-600"
        };
      case 'pending':
      default:
        return {
          badge: <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>,
          message: "Document uploaded, waiting for admin review",
          color: "text-gray-600"
        };
    }
  };

  const { badge, message, color } = getStatusDisplay();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{document.name}</span>
        {badge}
      </div>
      <p className={`text-sm ${color}`}>
        {message}
      </p>
      {document.verified_at && (
        <p className="text-xs text-muted-foreground">
          Verified on {new Date(document.verified_at).toLocaleDateString()} at {new Date(document.verified_at).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}