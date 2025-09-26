import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Building2, Shield, TrendingUp, ArrowLeft } from "lucide-react";

export default function AuthSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ayush-light to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Portal</h1>
          <p className="text-lg text-muted-foreground">
            Select the appropriate portal based on your role
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Startup Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-ayush-light w-fit group-hover:bg-ayush-green/10 transition-colors">
                <Building2 className="h-12 w-12 text-ayush-green" />
              </div>
              <CardTitle className="text-2xl mb-2">Startup Portal</CardTitle>
              <CardDescription className="text-base">
                Register your AYUSH startup, upload documents, and track your application status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Complete startup registration</li>
                <li>• Upload required documents</li>
                <li>• Track verification status</li>
                <li>• Access funding opportunities</li>
              </ul>
              <Button asChild className="w-full">
                <Link to="/auth/startup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-ayush-light w-fit group-hover:bg-ayush-green/10 transition-colors">
                <Shield className="h-12 w-12 text-ayush-green" />
              </div>
              <CardTitle className="text-2xl mb-2">Admin Portal</CardTitle>
              <CardDescription className="text-base">
                Verify documents, manage applications, and oversee the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Review startup applications</li>
                <li>• Verify uploaded documents</li>
                <li>• Manage platform settings</li>
                <li>• Generate reports</li>
              </ul>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/auth/admin">Admin Access</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Investor Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 p-4 rounded-full bg-ayush-light w-fit group-hover:bg-ayush-green/10 transition-colors">
                <TrendingUp className="h-12 w-12 text-ayush-green" />
              </div>
              <CardTitle className="text-2xl mb-2">Investor Portal</CardTitle>
              <CardDescription className="text-base">
                Discover and fund promising AYUSH startups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li>• Browse verified startups</li>
                <li>• Review business plans</li>
                <li>• Make funding offers</li>
                <li>• Track investments</li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link to="/auth/investor">Explore Startups</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}