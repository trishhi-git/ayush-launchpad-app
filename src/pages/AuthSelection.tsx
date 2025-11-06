import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, Shield, TrendingUp, ArrowLeft } from "lucide-react";

export default function AuthSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Select Access Portal</h1>
          <p className="text-lg text-muted-foreground">
            Choose your role to access the appropriate dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Startup Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 w-fit group-hover:bg-green-200 transition-colors">
                <Building2 className="h-12 w-12 text-green-700" />
              </div>
              <CardTitle className="text-2xl mb-2">Business Portal</CardTitle>
              <CardDescription className="text-base">
                Register your healthcare business, upload documents, and track application progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Complete business registration</li>
                <li>• Submit required documents</li>
                <li>• Monitor verification progress</li>
                <li>• Connect with investors</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/auth/startup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 w-fit group-hover:bg-green-200 transition-colors">
                <Shield className="h-12 w-12 text-green-700" />
              </div>
              <CardTitle className="text-2xl mb-2">Admin Portal</CardTitle>
              <CardDescription className="text-base">
                Review applications, verify documents, and manage platform operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Review business applications</li>
                <li>• Verify submitted documents</li>
                <li>• Oversee platform operations</li>
                <li>• Generate compliance reports</li>
              </ul>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/auth/admin">Admin Access</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Investor Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 w-fit group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-12 w-12 text-green-700" />
              </div>
              <CardTitle className="text-2xl mb-2">Investor Portal</CardTitle>
              <CardDescription className="text-base">
                Discover and fund promising healthcare businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Browse certified businesses</li>
                <li>• Evaluate business proposals</li>
                <li>• Submit investment offers</li>
                <li>• Monitor portfolio performance</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth/investor">View Opportunities</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}