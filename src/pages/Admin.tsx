import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentVerifier from "@/components/admin/DocumentVerifier";
import { ApplicationManager } from "@/components/admin/ApplicationManager";
import { AdminInvestment } from "@/components/admin/AdminInvestment";
import { FileCheck, LogOut, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check for admin session
  const adminSession = localStorage.getItem('admin_session');
  const isAdmin = adminSession ? JSON.parse(adminSession).role === 'admin' : false;
  const adminEmail = adminSession ? JSON.parse(adminSession).email : '';

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/auth-selection');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth-selection">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">AYUSH Portal Admin</h1>
            <p className="text-muted-foreground mt-2">
              Welcome, {adminEmail} • Manage startup applications and verify documents
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="investments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Investments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <DocumentVerifier />
          </TabsContent>

          <TabsContent value="investments">
            <AdminInvestment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}