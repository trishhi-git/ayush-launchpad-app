import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(jwt)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { method } = req
    const url = new URL(req.url)

    switch (method) {
      case 'POST':
        return await verifyDocument(req, supabaseClient, user.id)
      case 'GET':
        const action = url.searchParams.get('action')
        if (action === 'pending') {
          return await getPendingDocuments(supabaseClient)
        } else if (action === 'history') {
          return await getVerificationHistory(req, supabaseClient)
        }
        break
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in document-verifier:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function verifyDocument(req: Request, supabase: any, userId: string) {
  const { documentId, status, notes } = await req.json()
  
  // Input validation
  if (!documentId || typeof documentId !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Valid document ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
  
  if (!status || typeof status !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Valid status is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  console.log('Verifying document:', String(documentId).replace(/[\r\n]/g, ' '), String(status).replace(/[\r\n]/g, ' '))

  // Validate status
  const validStatuses = ['approved', 'rejected', 'under_review']
  if (!validStatuses.includes(status)) {
    return new Response(
      JSON.stringify({ error: 'Invalid status. Must be one of: approved, rejected, under_review' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Check if document exists
  const { data: document, error: docError } = await supabase
    .from('documents')
    .select('*, applications!inner(company_name)')
    .eq('id', documentId)
    .single()

  if (docError || !document) {
    return new Response(
      JSON.stringify({ error: 'Document not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Insert verification log (this will trigger the update function)
    const { error: logError } = await supabase
      .from('document_verification_logs')
      .insert({
        document_id: documentId,
        status: status,
        notes: notes,
        verified_by: userId
      })

    if (logError) {
      console.error('Error inserting verification log:', String(logError).replace(/[\r\n]/g, ' '))
      throw logError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Document "${document.name}" has been ${status}`,
        document: {
          id: document.id,
          name: document.name,
          verification_status: status,
          company: document.applications.company_name
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error verifying document:', String(error).replace(/[\r\n]/g, ' '))
    return new Response(
      JSON.stringify({ error: 'Failed to verify document' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getPendingDocuments(supabase: any) {
  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        id,
        name,
        file_size,
        mime_type,
        uploaded_at,
        verification_status,
        file_path,
        applications!inner(
          id,
          company_name,
          application_id,
          ayush_category,
          profiles!inner(
            full_name,
            email
          )
        )
      `)
      .in('verification_status', ['pending', 'under_review'])
      .not('file_path', 'is', null)
      .order('uploaded_at', { ascending: true })

    if (error) {
      console.error('Error fetching pending documents:', String(error).replace(/[\r\n]/g, ' '))
      throw error
    }

    return new Response(
      JSON.stringify({ 
        documents: documents || [],
        count: documents?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting pending documents:', String(error).replace(/[\r\n]/g, ' '))
    return new Response(
      JSON.stringify({ error: 'Failed to fetch pending documents' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getVerificationHistory(req: Request, supabase: any) {
  const url = new URL(req.url)
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const offset = parseInt(url.searchParams.get('offset') || '0')

  try {
    const { data: logs, error } = await supabase
      .from('document_verification_logs')
      .select(`
        *,
        documents!inner(
          name,
          applications!inner(
            company_name,
            application_id
          )
        ),
        verified_by_profile:profiles!verified_by(
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching verification history:', String(error).replace(/[\r\n]/g, ' '))
      throw error
    }

    return new Response(
      JSON.stringify({ 
        logs: logs || [],
        count: logs?.length || 0,
        hasMore: (logs?.length || 0) === limit
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting verification history:', String(error).replace(/[\r\n]/g, ' '))
    return new Response(
      JSON.stringify({ error: 'Failed to fetch verification history' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}