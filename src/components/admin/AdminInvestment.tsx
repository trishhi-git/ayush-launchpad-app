import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, MapPin, Calendar, DollarSign, Eye, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  funding_goal: number;
  equity_offered: number;
  approved_at: string;
  created_at: string;
  status: string;
}

interface AdminInvestment {
  id: string;
  amount: number;
  equity_percentage: number;
  terms: string;
  status: string;
  created_at: string;
  application: {
    company_name: string;
    ayush_category: string;
  };
}

export function AdminInvestment() {
  const [startups, setStartups] = useState<ApprovedStartup[]>([]);
  const [investments, setInvestments] = useState<AdminInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [investmentData, setInvestmentData] = useState({
    amount: "",
    equity_percentage: "",
    terms: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchApprovedStartups();
    fetchAdminInvestments();
  }, []);

  const fetchApprovedStartups = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

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

  const fetchAdminInvestments = async () => {
    try {
      const adminSession = localStorage.getItem('admin_session');
      if (!adminSession) return;

      const { data, error } = await supabase
        .from("funding_requests")
        .select(`
          *,
          application:applications(company_name, ayush_category)
        `)
        .eq("investor_id", "admin")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error("Error fetching admin investments:", error);
    }
  };

  const handleInvestment = async (startupId: string) => {
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) return;

    try {
      const { error } = await supabase
        .from("funding_requests")
        .insert({
          investor_id: "admin",
          application_id: startupId,
          amount: parseFloat(investmentData.amount),
          equity_percentage: parseFloat(investmentData.equity_percentage),
          terms: investmentData.terms,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Government Investment Submitted",
        description: "Government investment proposal has been sent to the startup.",
      });

      setInvestmentData({ amount: "", equity_percentage: "", terms: "" });
      fetchAdminInvestments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit investment proposal",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Government Investment Portal</h2>
        <p className="text-muted-foreground">View government-approved AYUSH healthcare startups and make strategic investments</p>
      </div>

      <Tabs defaultValue="startups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="startups">Approved Startups</TabsTrigger>
          <TabsTrigger value="investments">My Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="startups">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups.map((startup) => (
              <Card key={startup.id} className="border-green-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{startup.company_name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Approved
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
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Funding Goal:</span>
                      <span className="font-medium">₹{startup.funding_goal?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equity Offered:</span>
                      <span className="font-medium">{startup.equity_offered}%</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Government Investment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Government Investment in {startup.company_name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Investment Amount (₹)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="5000000"
                            value={investmentData.amount}
                            onChange={(e) => setInvestmentData(prev => ({ ...prev, amount: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="equity">Equity Percentage (%)</Label>
                          <Input
                            id="equity"
                            type="number"
                            placeholder="15"
                            value={investmentData.equity_percentage}
                            onChange={(e) => setInvestmentData(prev => ({ ...prev, equity_percentage: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="terms">Investment Terms</Label>
                          <Textarea
                            id="terms"
                            placeholder="Government strategic investment with AYUSH ministry support and regulatory benefits..."
                            value={investmentData.terms}
                            onChange={(e) => setInvestmentData(prev => ({ ...prev, terms: e.target.value }))}
                          />
                        </div>
                        <Button 
                          onClick={() => handleInvestment(startup.id)}
                          className="w-full"
                        >
                          Submit Government Investment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investments">
          <Card>
            <CardHeader>
              <CardTitle>Government Investment Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              {investments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No investments made yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Equity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell className="font-medium">
                          {investment.application?.company_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {investment.application?.ayush_category}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{investment.amount.toLocaleString()}</TableCell>
                        <TableCell>{investment.equity_percentage}%</TableCell>
                        <TableCell>
                          <Badge 
                            variant={investment.status === 'approved' ? 'default' : 'secondary'}
                          >
                            {investment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(investment.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}