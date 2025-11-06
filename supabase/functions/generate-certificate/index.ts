import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    const { applicationId } = await req.json()

    if (!applicationId) {
      return new Response(
        JSON.stringify({ error: 'Application ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch application details
    const { data: application, error } = await supabaseClient
      .from('applications')
      .select(`
        *,
        profiles!inner(full_name, email)
      `)
      .eq('id', applicationId)
      .eq('status', 'approved')
      .single()

    if (error || !application) {
      return new Response(
        JSON.stringify({ error: 'Application not found or not approved' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate certificate content
    const certificateHTML = generateCertificateHTML(application)
    const certificateData = new TextEncoder().encode(certificateHTML)

    return new Response(certificateData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="AYUSH_Certificate_${application.application_id}.html"`
      }
    })

  } catch (error) {
    console.error('Error generating certificate:', String(error).replace(/[\r\n]/g, ' '))
    return new Response(
      JSON.stringify({ error: 'Failed to generate certificate' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function generateCertificateHTML(application: any): string {
  const currentDate = new Date().toLocaleDateString('en-IN')
  
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AYUSH Registration Certificate</title>
    <style>
        body { font-family: 'Times New Roman', serif; margin: 0; padding: 40px; background: #fff; }
        .certificate { max-width: 800px; margin: 0 auto; border: 3px solid #2E7D32; padding: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #2E7D32; margin-bottom: 10px; }
        .title { font-size: 28px; font-weight: bold; color: #1B5E20; margin: 20px 0; }
        .subtitle { font-size: 18px; color: #424242; margin-bottom: 30px; }
        .content { line-height: 1.8; font-size: 16px; }
        .company-name { font-size: 22px; font-weight: bold; color: #2E7D32; }
        .details { margin: 20px 0; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; }
        .signature { text-align: center; }
        .seal { width: 100px; height: 100px; border: 2px solid #2E7D32; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #2E7D32; }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo">🕉️ MINISTRY OF AYUSH</div>
            <div style="font-size: 14px; color: #666;">Government of India</div>
            <div class="title">CERTIFICATE OF REGISTRATION</div>
            <div class="subtitle">AYUSH Startup Registration Portal</div>
        </div>
        
        <div class="content">
            <p>This is to certify that</p>
            
            <div class="company-name">${application.company_name}</div>
            
            <div class="details">
                <p><strong>Application ID:</strong> ${application.application_id}</p>
                <p><strong>Category:</strong> ${application.ayush_category}</p>
                <p><strong>Location:</strong> ${application.location}</p>
                <p><strong>Founded Year:</strong> ${application.founded_year}</p>
                <p><strong>Founder:</strong> ${application.profiles.full_name}</p>
            </div>
            
            <p>has been successfully registered under the AYUSH Startup Registration Portal and is authorized to operate as a traditional medicine startup in accordance with the guidelines and regulations set forth by the Ministry of AYUSH, Government of India.</p>
            
            <p>This certificate is valid and serves as official recognition of the startup's compliance with AYUSH standards and regulations.</p>
            
            <p><strong>Date of Issue:</strong> ${currentDate}</p>
            <p><strong>Certificate ID:</strong> AYUSH-${application.application_id}-${new Date().getFullYear()}</p>
        </div>
        
        <div class="footer">
            <div class="signature">
                <div class="seal">OFFICIAL SEAL</div>
                <div>Authorized Officer</div>
                <div>Ministry of AYUSH</div>
            </div>
            <div class="signature">
                <div style="margin-bottom: 50px;"></div>
                <div>Digital Signature</div>
                <div>Government of India</div>
            </div>
        </div>
    </div>
</body>
</html>`
}