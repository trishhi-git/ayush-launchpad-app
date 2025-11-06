import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function StorageTest() {
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  const testStorage = async () => {
    setTesting(true);
    try {
      // Test if we can list buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      if (bucketsError) {
        throw bucketsError;
      }

      // Check if documents bucket exists
      const documentsBucket = buckets?.find(bucket => bucket.id === 'documents');
      if (!documentsBucket) {
        throw new Error('Documents bucket not found');
      }

      // Try to create a test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`test-${Date.now()}.txt`, testFile);

      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: "Storage Test Passed",
        description: "Storage is working correctly",
      });
    } catch (error) {
      console.error('Storage test failed:', error);
      toast({
        title: "Storage Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Button onClick={testStorage} disabled={testing} variant="outline">
      {testing ? "Testing..." : "Test Storage"}
    </Button>
  );
}