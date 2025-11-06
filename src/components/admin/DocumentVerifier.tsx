import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function DocumentVerifier() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          applications(
            company_name,
            application_id,
            ayush_category,
            profiles(
              full_name,
              email
            )
          )
        `)
        .not('file_path', 'is', null);
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (docId, status) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ verification_status: status })
        .eq('id', docId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Document ${status}`,
      });
      
      fetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      });
    }
  };

  const viewDocument = async (filePath) => {
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

  if (loading) return <div className="p-4">Loading documents...</div>;

  const pendingDocs = documents.filter(doc => !doc.verification_status || doc.verification_status === 'pending');
  const approvedDocs = documents.filter(doc => doc.verification_status === 'approved');
  const rejectedDocs = documents.filter(doc => doc.verification_status === 'rejected');

  const renderDocuments = (docs, showActions = true) => (
    <div className="space-y-4">
      {docs.map((doc) => (
        <div key={doc.id} className="bg-white p-4 rounded border">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{doc.name}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-semibold text-blue-600">
                  🏢 Company: {doc.applications?.company_name || 'Unknown Company'}
                </p>
                <p className="text-sm font-semibold text-green-600">
                  👤 User: {doc.applications?.profiles?.full_name || 'Unknown User'}
                </p>
                <p className="text-sm text-gray-600">
                  📧 Email: {doc.applications?.profiles?.email || 'Unknown Email'}
                </p>
                <p className="text-sm text-gray-600">
                  🏷️ Category: {doc.applications?.ayush_category || 'Unknown'}
                </p>
                <p className="text-sm text-gray-600">
                  🆔 App ID: {doc.applications?.application_id || doc.application_id}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => viewDocument(doc.file_path)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                View Document
              </button>
              {showActions && (
                <>
                  <button 
                    onClick={() => handleVerification(doc.id, 'approved')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleVerification(doc.id, 'rejected')}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {docs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No documents in this category
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Document Management</h1>
      
      <div className="bg-blue-100 p-4 rounded mb-4">
        <p>Total: {documents.length} documents | Pending: {pendingDocs.length} | Approved: {approvedDocs.length} | Rejected: {rejectedDocs.length}</p>
      </div>
      
      <div className="border rounded-lg">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Pending ({pendingDocs.length})
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 font-medium ${activeTab === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Approved ({approvedDocs.length})
          </button>
          <button 
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium ${activeTab === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Rejected ({rejectedDocs.length})
          </button>
        </div>
        
        <div className="p-4">
          {activeTab === 'pending' && renderDocuments(pendingDocs, true)}
          {activeTab === 'approved' && renderDocuments(approvedDocs, false)}
          {activeTab === 'rejected' && renderDocuments(rejectedDocs, false)}
        </div>
      </div>
    </div>
  );
}