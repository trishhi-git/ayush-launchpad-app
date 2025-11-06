import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Application {
  id: string;
  application_id: string;
  company_name: string;
  ayush_category: string;
  founded_year: number;
  business_model: string;
  location: string;
  business_description?: string;
  target_market?: string;
  funding_stage?: string;
  status: string;
  current_step: number;
  total_steps: number;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  application_id: string;
  name: string;
  file_path?: string;
  status: string;
  uploaded_at?: string;
  verified_at?: string;
  verification_status?: string;
  verification_notes?: string;
  verified_by?: string;
  file_size?: number;
  mime_type?: string;
}

export interface ActivityLog {
  id: string;
  application_id: string;
  type: string;
  message: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  qualification?: string;
}

export function useApplicationData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
      
      // Set up real-time subscription for document status changes
      const subscription = supabase
        .channel('user-document-changes')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'documents',
            filter: `application_id=in.(${application?.id || 'null'})`
          },
          () => {
            if (application) {
              fetchDocuments(application.id);
              fetchActivities(application.id);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, application?.id]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchApplication(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", String(error).replace(/[\r\n]/g, ' '));
      toast({
        title: "Error",
        description: "Failed to load application data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching profile:", String(error).replace(/[\r\n]/g, ' '));
      return;
    }

    setProfile(data);
  };

  const fetchApplication = async () => {
    if (!user) return;

    const { data: applicationData, error: appError } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (appError) {
      console.error("Error fetching application:", String(appError).replace(/[\r\n]/g, ' '));
      return;
    }

    setApplication(applicationData);

    // If application exists, fetch related data
    if (applicationData) {
      await Promise.all([
        fetchDocuments(applicationData.id),
        fetchActivities(applicationData.id),
      ]);
    }
  };

  const fetchDocuments = async (applicationId: string) => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching documents:", error);
      return;
    }

    setDocuments(data || []);
    
    // Show toast for newly verified documents
    const newlyVerified = (data || []).filter(doc => 
      doc.verification_status === 'approved' || doc.verification_status === 'rejected'
    );
    
    newlyVerified.forEach(doc => {
      if (doc.verified_at && new Date(doc.verified_at) > new Date(Date.now() - 30000)) {
        toast({
          title: doc.verification_status === 'approved' ? "Document Approved" : "Document Rejected",
          description: `${doc.name} has been ${doc.verification_status}`,
          variant: doc.verification_status === 'approved' ? "default" : "destructive",
        });
      }
    });
    
    // Update application status based on document progress
    if (data && data.length > 0) {
      await updateApplicationStatus(applicationId, data);
    }
  };

  const fetchActivities = async (applicationId: string) => {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .eq("application_id", applicationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching activities:", error);
      return;
    }

    setActivities(data || []);
  };

  const createApplication = async (applicationData: Partial<Application>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        application_id: "", // Will be auto-generated by trigger
        company_name: applicationData.company_name || "",
        ayush_category: applicationData.ayush_category || "",
        founded_year: applicationData.founded_year || new Date().getFullYear(),
        business_model: applicationData.business_model || "",
        location: applicationData.location || "",
        business_description: applicationData.business_description,
        target_market: applicationData.target_market,
        funding_stage: applicationData.funding_stage,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating application:", String(error).replace(/[\r\n]/g, ' '));
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive",
      });
      return null;
    }

    // Create default documents
    const defaultDocuments = [
      { name: "Company Registration Certificate", status: "required" },
      { name: "Founder ID Proof", status: "required" },
      { name: "Business Plan", status: "required" },
      { name: "Financial Statements", status: "required" },
    ];

    await supabase
      .from("documents")
      .insert(defaultDocuments.map(doc => ({
        application_id: data.id,
        ...doc,
      })));

    // Log application creation
    await supabase
      .from("activity_logs")
      .insert({
        application_id: data.id,
        type: "application-submit",
        message: "Application created successfully",
        created_by: user.id,
      });

    setApplication(data);
    await fetchDocuments(data.id);
    await fetchActivities(data.id);

    toast({
      title: "Success",
      description: "Application created successfully!",
    });

    return data;
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating profile:", String(error).replace(/[\r\n]/g, ' '));
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    setProfile({ ...profile, ...profileData });
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
  };

  const uploadDocument = async (file: File, documentId: string) => {
    if (!user || !application) return false;

    try {
      // Basic file validation
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload PDF, JPG, or PNG files only');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentId}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', String(uploadError).replace(/[\r\n]/g, ' '));
        throw new Error('Failed to upload file to storage');
      }

      // Update document record
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          file_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          status: "uploaded",
          uploaded_at: new Date().toISOString(),
          verification_status: 'pending'
        })
        .eq('id', documentId);

      if (updateError) {
        console.error('Update error:', String(updateError).replace(/[\r\n]/g, ' '));
        throw new Error('Failed to update document record');
      }

      // Log document upload
      await supabase
        .from("activity_logs")
        .insert({
          application_id: application.id,
          type: "document-upload",
          message: `Document "${file.name}" uploaded successfully`,
          created_by: user.id,
        });

      await fetchDocuments(application.id);
      await fetchActivities(application.id);

      toast({
        title: "Success",
        description: "Document uploaded successfully!",
      });

      return true;
      
    } catch (error) {
      console.error('Error uploading document:', String(error).replace(/[\r\n]/g, ' '));
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload document",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateApplicationStatus = async (applicationId: string, docs: Document[]) => {
    const approvedDocs = docs.filter(doc => doc.verification_status === 'approved').length;
    const uploadedDocs = docs.filter(doc => doc.file_path).length;
    const totalDocs = docs.length;
    
    let newStatus = 'draft';
    let currentStep = 1;
    
    if (uploadedDocs === totalDocs && approvedDocs === totalDocs) {
      newStatus = 'under-review';
      currentStep = 4;
    } else if (uploadedDocs === totalDocs) {
      newStatus = 'submitted';
      currentStep = 3;
    } else if (uploadedDocs > 0) {
      newStatus = 'draft';
      currentStep = 2;
    }
    
    // Only update if status has changed
    if (application && (application.status !== newStatus || application.current_step !== currentStep)) {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus, 
          current_step: currentStep,
          submitted_at: newStatus === 'submitted' ? new Date().toISOString() : application.submitted_at
        })
        .eq('id', applicationId);
        
      if (!error) {
        setApplication(prev => prev ? {
          ...prev,
          status: newStatus,
          current_step: currentStep,
          submitted_at: newStatus === 'submitted' && !prev.submitted_at ? new Date().toISOString() : prev.submitted_at
        } : null);
      }
    }
  };

  return {
    application,
    documents,
    activities,
    profile,
    loading,
    createApplication,
    updateProfile,
    uploadDocument,
    refetch: fetchAllData,
  };
}