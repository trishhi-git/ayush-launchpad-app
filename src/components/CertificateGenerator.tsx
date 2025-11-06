import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CertificateProps {
  application: {
    id: string;
    application_id: string;
    company_name: string;
    ayush_category: string;
    location: string;
    founded_year: number;
    approved_at?: string;
  };
}

export function CertificateGenerator({ application }: CertificateProps) {
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generateCertificate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-certificate', {
        body: { applicationId: application.id }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([data.certificate], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AYUSH_Certificate_${application.application_id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Certificate Generated",
        description: "Your AYUSH registration certificate has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate certificate",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 w-fit">
          <Award className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-green-800">Registration Approved!</CardTitle>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          AYUSH Certified
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">{application.company_name}</h3>
          <p className="text-sm text-muted-foreground">
            Application ID: {application.application_id}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{application.ayush_category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {application.location}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Founded: {application.founded_year}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Approved: {new Date(application.approved_at || '').toLocaleDateString()}
          </div>
        </div>

        <Button 
          onClick={generateCertificate}
          disabled={generating}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {generating ? (
            "Generating Certificate..."
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}