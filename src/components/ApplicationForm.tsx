import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationData, Application } from "@/hooks/useApplicationData";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  onComplete: () => void;
}

export default function ApplicationForm({ onComplete }: ApplicationFormProps) {
  const { createApplication } = useApplicationData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    ayush_category: "",
    founded_year: new Date().getFullYear(),
    business_model: "",
    location: "",
    business_description: "",
    target_market: "",
    funding_stage: "",
  });

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createApplication(formData);
      if (result) {
        onComplete();
      }
    } catch (error) {
      console.error("Error creating application:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your AYUSH Startup Application</CardTitle>
        <CardDescription>
          Fill in your startup details to begin the registration process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ayush_category">AYUSH Category *</Label>
              <Select
                value={formData.ayush_category}
                onValueChange={(value) => handleInputChange("ayush_category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="Unani">Unani</SelectItem>
                  <SelectItem value="Siddha">Siddha</SelectItem>
                  <SelectItem value="Homeopathy">Homeopathy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="founded_year">Founded Year *</Label>
              <Input
                id="founded_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.founded_year}
                onChange={(e) => handleInputChange("founded_year", parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business_model">Business Model *</Label>
              <Select
                value={formData.business_model}
                onValueChange={(value) => handleInputChange("business_model", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2C">B2C (Business to Consumer)</SelectItem>
                  <SelectItem value="B2B">B2B (Business to Business)</SelectItem>
                  <SelectItem value="B2B2C">B2B2C (Business to Business to Consumer)</SelectItem>
                  <SelectItem value="Marketplace">Marketplace</SelectItem>
                  <SelectItem value="SaaS">SaaS (Software as a Service)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="business_description">Business Description</Label>
            <Textarea
              id="business_description"
              placeholder="Describe your business and its objectives"
              value={formData.business_description}
              onChange={(e) => handleInputChange("business_description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_market">Target Market</Label>
            <Textarea
              id="target_market"
              placeholder="Describe your target audience and market"
              value={formData.target_market}
              onChange={(e) => handleInputChange("target_market", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding_stage">Funding Stage</Label>
            <Select
              value={formData.funding_stage}
              onValueChange={(value) => handleInputChange("funding_stage", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select funding stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C+">Series C+</SelectItem>
                <SelectItem value="Bootstrapped">Bootstrapped</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-ayush-green hover:bg-ayush-green/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Application...
              </>
            ) : (
              'Create Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}