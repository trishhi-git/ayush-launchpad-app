-- Simple certificate fix without approved_at column
-- Run this in your Supabase SQL Editor

-- 1. Check current status of applications with approved documents
SELECT 
    a.id,
    a.application_id,
    a.company_name,
    a.status,
    COUNT(d.id) as total_docs,
    COUNT(CASE WHEN d.verification_status = 'approved' THEN 1 END) as approved_docs
FROM applications a
LEFT JOIN documents d ON a.id = d.application_id
GROUP BY a.id, a.application_id, a.company_name, a.status
HAVING COUNT(d.id) > 0 AND COUNT(CASE WHEN d.verification_status = 'approved' THEN 1 END) = COUNT(d.id);

-- 2. Update applications to 'approved' status where all documents are approved
UPDATE applications 
SET 
    status = 'approved',
    updated_at = NOW()
WHERE id IN (
    SELECT a.id
    FROM applications a
    LEFT JOIN documents d ON a.id = d.application_id
    WHERE a.status != 'approved'
    GROUP BY a.id
    HAVING COUNT(d.id) > 0 AND COUNT(CASE WHEN d.verification_status = 'approved' THEN 1 END) = COUNT(d.id)
);

-- 3. Create a function to automatically approve applications when all documents are approved
CREATE OR REPLACE FUNCTION auto_approve_application()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if all documents for this application are now approved
    IF NEW.verification_status = 'approved' THEN
        -- Count total documents and approved documents for this application
        DECLARE
            total_docs INTEGER;
            approved_docs INTEGER;
        BEGIN
            SELECT COUNT(*) INTO total_docs
            FROM documents 
            WHERE application_id = NEW.application_id;
            
            SELECT COUNT(*) INTO approved_docs
            FROM documents 
            WHERE application_id = NEW.application_id 
            AND verification_status = 'approved';
            
            -- If all documents are approved, update application status
            IF total_docs = approved_docs AND total_docs > 0 THEN
                UPDATE applications 
                SET 
                    status = 'approved',
                    updated_at = NOW()
                WHERE id = NEW.application_id 
                AND status != 'approved';
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to auto-approve applications
DROP TRIGGER IF EXISTS trigger_auto_approve_application ON documents;
CREATE TRIGGER trigger_auto_approve_application
    AFTER UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION auto_approve_application();

-- 5. Verify the results
SELECT 
    a.id,
    a.application_id,
    a.company_name,
    a.status,
    a.updated_at,
    COUNT(d.id) as total_docs,
    COUNT(CASE WHEN d.verification_status = 'approved' THEN 1 END) as approved_docs
FROM applications a
LEFT JOIN documents d ON a.id = d.application_id
GROUP BY a.id, a.application_id, a.company_name, a.status, a.updated_at
ORDER BY a.created_at DESC;