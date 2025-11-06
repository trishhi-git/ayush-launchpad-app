import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function DatabaseTest() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    try {
      // Test 1: Check connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      // Test 2: Test auth
      const { data: authData } = await supabase.auth.getSession();

      // Test 3: Test storage
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

      setResults({
        connection: { success: !connectionError, error: connectionError?.message },
        auth: { session: !!authData.session, user: authData.session?.user?.email },
        storage: { success: !storageError, buckets: buckets?.length || 0 }
      });

      toast({
        title: "Database Test Complete",
        description: "Check results below",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const createTestData = async () => {
    setTesting(true);
    try {
      // Create test profile
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        throw new Error("Please login first");
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: authData.session.user.id,
          full_name: "Test User",
          email: authData.session.user.email,
        });

      if (profileError) throw profileError;

      // Create test application
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .insert({
          user_id: authData.session.user.id,
          company_name: "Test Healthcare Company",
          ayush_category: "Herbal Medicine",
          founded_year: 2024,
          business_model: "B2C",
          location: "Mumbai, India",
          business_description: "Test healthcare business",
        })
        .select()
        .single();

      if (appError) throw appError;

      // Create test documents
      const documents = [
        "Company Registration Certificate",
        "Founder ID Proof",
        "Business Plan",
        "Financial Statements"
      ];

      const { error: docsError } = await supabase
        .from('documents')
        .insert(
          documents.map(name => ({
            application_id: appData.id,
            name,
            status: "required"
          }))
        );

      if (docsError) throw docsError;

      toast({
        title: "Test Data Created",
        description: "Sample application and documents created successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to Create Test Data",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Database Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={testing}>
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={createTestData} disabled={testing} variant="outline">
            Create Test Data
          </Button>
        </div>

        {results && (
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium">Connection Test</h4>
              <p className="text-sm">
                Status: {results.connection.success ? "✅ Connected" : "❌ Failed"}
              </p>
              {results.connection.error && (
                <p className="text-sm text-red-600">{results.connection.error}</p>
              )}
            </div>

            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium">Authentication</h4>
              <p className="text-sm">
                Session: {results.auth.session ? "✅ Active" : "❌ None"}
              </p>
              {results.auth.user && (
                <p className="text-sm">User: {results.auth.user}</p>
              )}
            </div>

            <div className="p-3 bg-muted rounded">
              <h4 className="font-medium">Storage</h4>
              <p className="text-sm">
                Status: {results.storage.success ? "✅ Available" : "❌ Failed"}
              </p>
              <p className="text-sm">Buckets: {results.storage.buckets}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}