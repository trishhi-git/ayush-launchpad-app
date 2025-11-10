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
      // Fetch founder details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', (await supabase.from('applications').select('user_id').eq('id', application.id).single()).data?.user_id)
        .single();

      // Create certificate window
      const certificateWindow = window.open('', '_blank', 'width=800,height=600');
      
      const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>AYUSH Registration Certificate</title>
          <style>
              body {
                  font-family: 'Times New Roman', serif;
                  margin: 0;
                  padding: 40px;
                  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
              }
              .certificate {
                  max-width: 700px;
                  margin: 0 auto;
                  background: white;
                  border: 8px solid #166534;
                  border-radius: 20px;
                  padding: 40px;
                  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                  position: relative;
              }
              .certificate::before {
                  content: '';
                  position: absolute;
                  top: 20px;
                  left: 20px;
                  right: 20px;
                  bottom: 20px;
                  border: 2px solid #22c55e;
                  border-radius: 10px;
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .emblem {
                  width: 80px;
                  height: 80px;
                  background: #166534;
                  border-radius: 50%;
                  margin: 0 auto 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 24px;
                  font-weight: bold;
              }
              .govt-title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #166534;
                  margin: 10px 0;
              }
              .ministry {
                  font-size: 18px;
                  color: #059669;
                  margin: 5px 0;
              }
              .cert-title {
                  font-size: 28px;
                  font-weight: bold;
                  color: #dc2626;
                  margin: 30px 0;
                  text-decoration: underline;
              }
              .content {
                  text-align: center;
                  line-height: 1.8;
                  font-size: 16px;
                  color: #374151;
              }
              .company-name {
                  font-size: 24px;
                  font-weight: bold;
                  color: #166534;
                  text-decoration: underline;
              }
              .founder-name {
                  font-size: 20px;
                  font-weight: bold;
                  color: #059669;
              }
              .details {
                  margin: 30px 0;
                  text-align: left;
                  background: #f8fafc;
                  padding: 20px;
                  border-radius: 10px;
                  border-left: 4px solid #22c55e;
              }
              .detail-row {
                  display: flex;
                  justify-content: space-between;
                  margin: 10px 0;
                  padding: 5px 0;
                  border-bottom: 1px dotted #cbd5e1;
              }
              .detail-label {
                  font-weight: bold;
                  color: #374151;
              }
              .detail-value {
                  color: #059669;
                  font-weight: 600;
              }
              .signature-section {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 50px;
              }
              .signature {
                  text-align: center;
                  width: 200px;
              }
              .signature-line {
                  border-top: 2px solid #374151;
                  margin: 40px 0 10px;
              }
              .seal {
                  position: absolute;
                  bottom: 50px;
                  right: 50px;
                  width: 100px;
                  height: 100px;
                  border: 3px solid #dc2626;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: rgba(220, 38, 38, 0.1);
                  font-weight: bold;
                  color: #dc2626;
                  font-size: 12px;
                  text-align: center;
              }
              @media print {
                  body { background: white; }
                  .certificate { box-shadow: none; }
              }
          </style>
      </head>
      <body>
          <div class="certificate">
              <div class="header">
                  <div class="emblem">🏛️</div>
                  <div class="govt-title">GOVERNMENT OF INDIA</div>
                  <div class="ministry">MINISTRY OF AYUSH</div>
                  <div class="cert-title">CERTIFICATE OF REGISTRATION</div>
              </div>
              
              <div class="content">
                  <p>This is to certify that</p>
                  <div class="company-name">${application.company_name}</div>
                  <p>founded by</p>
                  <div class="founder-name">${profileData?.full_name || 'Registered Founder'}</div>
                  <p>has been successfully registered and approved under the<br>
                  <strong>AYUSH Startup Registration Portal</strong></p>
                  
                  <div class="details">
                      <div class="detail-row">
                          <span class="detail-label">Registration ID:</span>
                          <span class="detail-value">${application.application_id}</span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">AYUSH Category:</span>
                          <span class="detail-value">${application.ayush_category}</span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">Location:</span>
                          <span class="detail-value">${application.location}</span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">Founded Year:</span>
                          <span class="detail-value">${application.founded_year}</span>
                      </div>
                      <div class="detail-row">
                          <span class="detail-label">Date of Approval:</span>
                          <span class="detail-value">${new Date().toLocaleDateString('en-IN')}</span>
                      </div>
                  </div>
                  
                  <p>This startup is hereby <strong>AUTHORIZED</strong> to operate in the ${application.ayush_category} sector<br>
                  and is eligible for government schemes, funding opportunities, and regulatory benefits.</p>
              </div>
              
              <div class="signature-section">
                  <div class="signature">
                      <div class="signature-line"></div>
                      <div><strong>Registrar</strong></div>
                      <div>AYUSH Ministry</div>
                  </div>
                  <div class="signature">
                      <div class="signature">
                      <div class="signature-line"></div>
                      <div><strong>Director</strong></div>
                      <div>Startup Registration</div>
                  </div>
              </div>
              
              <div class="seal">
                  OFFICIAL<br>SEAL
              </div>
          </div>
          
          <div style="text-align: center; margin: 20px;">
              <button onclick="window.print()" style="background: #166534; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Print Certificate</button>
              <button onclick="window.close()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">Close</button>
          </div>
      </body>
      </html>
      `;
      
      if (certificateWindow) {
        certificateWindow.document.write(certificateHTML);
        certificateWindow.document.close();
      }

      toast({
        title: "Certificate Generated",
        description: "Your official AYUSH registration certificate is ready.",
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