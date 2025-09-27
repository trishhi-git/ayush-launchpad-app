import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";

export default function AdminAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "abc@gmail.com",
    password: "abc@123",
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      // Create the admin user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) throw error;

      if (data.user) {
        // Insert admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin'
          });

        if (roleError) throw roleError;

        toast({
          title: "Admin account created!",
          description: "You can now sign in with the admin credentials.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to create admin",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin credentials required.');
      }

      toast({
        title: "Admin access granted",
        description: "Welcome to the admin portal.",
      });

      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayush-light to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/auth-selection">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portal Selection
          </Link>
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-ayush-light w-fit">
              <Shield className="h-8 w-8 text-ayush-green" />
            </div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>
              Secure access for administrators only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 inline mr-2" />
                  This portal is restricted to authorized administrators only.
                </p>
              </div>

              <div className="space-y-2">
                <form onSubmit={handleSignIn}>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying credentials..." : "Sign In to Admin Portal"}
                  </Button>
                </form>
                
                <div className="text-center text-sm text-muted-foreground">or</div>
                
                <form onSubmit={handleCreateAdmin}>
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="w-full" 
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Creating admin account..." : "Create Admin Account"}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}