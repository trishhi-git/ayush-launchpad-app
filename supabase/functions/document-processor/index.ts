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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { method } = req
    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (method) {
      case 'POST':
        if (action === 'validate') {
          return await validateDocument(req, supabaseClient)
        } else if (action === 'process') {
          return await processDocument(req, supabaseClient)
        }
        break
      case 'GET':
        return await getDocumentInfo(req, supabaseClient)
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in document-processor:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function validateDocument(req: Request, supabase: any) {
  const { documentId, fileInfo } = await req.json()

  console.log('Validating document:', documentId, fileInfo)

  // Validate file type and size
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const maxSize = 10 * 1024 * 1024 // 10MB

  const validationResults = {
    valid: true,
    errors: [] as string[],
    warnings: [] as string[]
  }

  if (!allowedTypes.includes(fileInfo.type)) {
    validationResults.valid = false
    validationResults.errors.push(`File type ${fileInfo.type} is not allowed`)
  }

  if (fileInfo.size > maxSize) {
    validationResults.valid = false
    validationResults.errors.push(`File size ${fileInfo.size} exceeds maximum allowed size of ${maxSize} bytes`)
  }

  // Check if document exists
  const { data: document, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (error || !document) {
    validationResults.valid = false
    validationResults.errors.push('Document not found')
  }

  // Log validation attempt
  if (document) {
    await supabase
      .from('activity_logs')
      .insert({
        application_id: document.application_id,
        type: 'document_validation',
        message: `Document "${document.name}" validation ${validationResults.valid ? 'passed' : 'failed'}: ${validationResults.errors.join(', ')}`
      })
  }

  return new Response(
    JSON.stringify(validationResults),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function processDocument(req: Request, supabase: any) {
  const { documentId, fileMetadata } = await req.json()

  console.log('Processing document:', documentId, fileMetadata)

  try {
    // Update document with file metadata
    const { error } = await supabase
      .from('documents')
      .update({
        file_size: fileMetadata.size,
        mime_type: fileMetadata.type,
        uploaded_at: new Date().toISOString(),
        status: 'uploaded',
        verification_status: 'pending'
      })
      .eq('id', documentId)

    if (error) {
      console.error('Error updating document:', error)
      throw error
    }

    // Get document details for logging
    const { data: document } = await supabase
      .from('documents')
      .select('name, application_id')
      .eq('id', documentId)
      .single()

    // Log document processing
    await supabase
      .from('activity_logs')
      .insert({
        application_id: document.application_id,
        type: 'document_upload',
        message: `Document "${document.name}" uploaded successfully and is pending verification`
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Document processed successfully',
        status: 'uploaded',
        verification_status: 'pending'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing document:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process document' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function getDocumentInfo(req: Request, supabase: any) {
  const url = new URL(req.url)
  const documentId = url.searchParams.get('documentId')

  if (!documentId) {
    return new Response(
      JSON.stringify({ error: 'Document ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { data: document, error } = await supabase
    .from('documents')
    .select(`
      *,
      applications!inner(user_id)
    `)
    .eq('id', documentId)
    .single()

  if (error || !document) {
    return new Response(
      JSON.stringify({ error: 'Document not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Get verification logs
  const { data: verificationLogs } = await supabase
    .from('document_verification_logs')
    .select('*')
    .eq('document_id', documentId)
    .order('created_at', { ascending: false })

  return new Response(
    JSON.stringify({ 
      document,
      verificationLogs: verificationLogs || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}