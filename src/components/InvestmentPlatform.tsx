import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUp, MapPin, Calendar, DollarSign, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ApprovedStartup {
  id: string;
  application_id: string;
  company_name: string;
  ayush_category: string;
  location: string;
  business_description: string;
  target_market: string;
  funding_stage: string;
  approved_at: string;
}

export function InvestmentPlatform() {
  const [startups, setStartups] = useState<ApprovedStartup[]>([]);
  const [loading, setLoading] = useState(true);
  const [investmentData, setInvestmentData] = useState({
    amount: "",
    equity_percentage: "",
    terms: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovedStartups();
  }, []);

  const fetchApprovedStartups = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("status", "approved")
        .order("approved_at", { ascending: false });

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load approved startups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvestment = async (startupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("investments")
        .insert({
          investor_id: user.id,
          startup_id: startupId,
          amount: parseFloat(investmentData.amount),
          equity_percentage: parseFloat(investmentData.equity_percentage),
          terms: investmentData.terms,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Investment Proposal Sent",
        description: "Your investment proposal has been sent to the startup.",
      });

      setInvestmentData({ amount: "", equity_percentage: "", terms: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit investment proposal",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading approved startups...</div>;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">AYUSH Certified Startups</h2>
        <p className="text-muted-foreground">Invest in government-approved traditional medicine startups</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {startups.map((startup) => (
          <Card key={startup.id} className="border-green-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{startup.company_name}</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  AYUSH Certified
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {startup.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline">{startup.ayush_category}</Badge>
                <Badge variant="outline">{startup.funding_stage}</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3">
                {startup.business_description}
              </p>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Approved: {new Date(startup.approved_at).toLocaleDateString()}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Invest Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Investment Proposal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Investment Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1000000"
                        value={investmentData.amount}
                        onChange={(e) => setInvestmentData(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="equity">Equity Percentage (%)</Label>
                      <Input
                        id="equity"
                        type="number"
                        placeholder="10"
                        value={investmentData.equity_percentage}
                        onChange={(e) => setInvestmentData(prev => ({ ...prev, equity_percentage: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="terms">Investment Terms</Label>
                      <Textarea
                        id="terms"
                        placeholder="Describe your investment terms and conditions..."
                        value={investmentData.terms}
                        onChange={(e) => setInvestmentData(prev => ({ ...prev, terms: e.target.value }))}
                      />
                    </div>
                    <Button 
                      onClick={() => handleInvestment(startup.id)}
                      className="w-full"
                    >
                      Submit Proposal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}