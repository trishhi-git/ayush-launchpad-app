import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { InvestmentPlatform } from "@/components/InvestmentPlatform";
import { TrendingUp, Building2, MapPin, Users, IndianRupee, Calendar, Eye } from "lucide-react";

interface Application {
  id: string;
  company_name: string;
  ayush_category: string;
  business_description: string;
  location: string;
  founded_year: number;
  funding_goal: number;
  equity_offered: number;
  funding_raised: number;
  is_seeking_funding: boolean;
  status: string;
  user_id: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

interface FundingRequest {
  id: string;
  amount: number;
  equity_percentage: number;
  status: string;
  message: string;
  created_at: string;
  applications: {
    company_name: string;
  };
}

export default function InvestorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startups, setStartups] = useState<Application[]>([]);
  const [myInvestments, setMyInvestments] = useState<FundingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStartup, setSelectedStartup] = useState<Application | null>(null);
  const [fundingData, setFundingData] = useState({
    amount: "",
    equity_percentage: "",
    message: "",
    terms: "",
  });

  useEffect(() => {
    if (user) {
      fetchStartups();
      fetchMyInvestments();
    }
  }, [user]);

  const fetchStartups = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('status', 'approved');

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error('Error fetching startups:', error);
      toast({
        title: "Error",
        description: "Failed to fetch startups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInvestments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('funding_requests')
        .select(`
          *,
          applications (
            company_name
          )
        `)
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const handleMakeFundingOffer = async () => {
    if (!selectedStartup || !user) return;

    try {
      const { error } = await supabase.from('funding_requests').insert({
        application_id: selectedStartup.id,
        investor_id: user.id,
        amount: parseFloat(fundingData.amount),
        equity_percentage: parseFloat(fundingData.equity_percentage),
        message: fundingData.message,
        terms: fundingData.terms,
      });

      if (error) throw error;

      toast({
        title: "Funding offer submitted!",
        description: "Your investment proposal has been sent to the startup.",
      });

      setFundingData({ amount: "", equity_percentage: "", message: "", terms: "" });
      setSelectedStartup(null);
      fetchMyInvestments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 animate-spin text-ayush-green mx-auto mb-4" />
          <p>Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayush-light to-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investor Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Invest in government-approved AYUSH healthcare startups
          </p>
        </div>

        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="opportunities">Approved Startups</TabsTrigger>
            <TabsTrigger value="investments">My Investments</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <Card key={startup.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{startup.company_name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Building2 className="h-4 w-4 mr-1" />
                          {startup.ayush_category}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Government Approved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {startup.business_description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {startup.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        Founded {startup.founded_year}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {startup.profiles?.full_name || 'Anonymous'}
                      </div>
                    </div>

                    {startup.funding_goal && (
                      <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Funding Goal:</span>
                          <span className="font-medium">₹{startup.funding_goal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Equity Offered:</span>
                          <span className="font-medium">{startup.equity_offered}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Raised So Far:</span>
                          <span className="font-medium text-ayush-green">₹{startup.funding_raised.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          onClick={() => setSelectedStartup(startup)}
                        >
                          <IndianRupee className="h-4 w-4 mr-2" />
                          Make Investment Offer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Investment Proposal</DialogTitle>
                          <DialogDescription>
                            Make a funding offer to {selectedStartup?.company_name}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="amount">Investment Amount (₹)</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="e.g., 1000000"
                              value={fundingData.amount}
                              onChange={(e) => setFundingData(prev => ({ ...prev, amount: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="equity">Equity Percentage (%)</Label>
                            <Input
                              id="equity"
                              type="number"
                              placeholder="e.g., 20"
                              value={fundingData.equity_percentage}
                              onChange={(e) => setFundingData(prev => ({ ...prev, equity_percentage: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="message">Message to Startup</Label>
                            <Textarea
                              id="message"
                              placeholder="Introduce yourself and explain your interest..."
                              value={fundingData.message}
                              onChange={(e) => setFundingData(prev => ({ ...prev, message: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="terms">Terms & Conditions</Label>
                            <Textarea
                              id="terms"
                              placeholder="Specify any terms or conditions..."
                              value={fundingData.terms}
                              onChange={(e) => setFundingData(prev => ({ ...prev, terms: e.target.value }))}
                            />
                          </div>
                          
                          <Button 
                            className="w-full" 
                            onClick={handleMakeFundingOffer}
                            disabled={!fundingData.amount || !fundingData.equity_percentage}
                          >
                            Submit Investment Offer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>

            {startups.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No approved startups available</h3>
                  <p className="text-muted-foreground">
                    Government-approved AYUSH startups will appear here for investment.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="investments">
            <div className="space-y-4">
              {myInvestments.map((investment) => (
                <Card key={investment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{investment.applications.company_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ₹{investment.amount.toLocaleString()} for {investment.equity_percentage}% equity
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(investment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                    {investment.message && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{investment.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {myInvestments.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <IndianRupee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No investments yet</h3>
                    <p className="text-muted-foreground">
                      Start investing in promising AYUSH startups.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}