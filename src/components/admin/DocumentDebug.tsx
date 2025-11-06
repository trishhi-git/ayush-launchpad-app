import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export function DocumentDebug() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testQueries = async () => {
    setLoading(true);
    try {
      // Test 1: Check documents table
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .limit(5);

      // Test 2: Check applications table
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .limit(5);

      // Test 3: Check profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      setResults({
        documents: { data: docs, error: docsError },
        applications: { data: apps, error: appsError },
        profiles: { data: profiles, error: profilesError }
      });
    } catch (error) {
      console.error('Debug error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testQueries} disabled={loading}>
          {loading ? "Testing..." : "Test Database"}
        </Button>
        
        {results && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium">Documents ({results.documents.data?.length || 0})</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(results.documents, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium">Applications ({results.applications.data?.length || 0})</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(results.applications, null, 2)}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium">Profiles ({results.profiles.data?.length || 0})</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(results.profiles, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}