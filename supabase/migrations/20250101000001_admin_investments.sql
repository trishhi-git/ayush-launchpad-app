-- Enable admin investments in funding_requests table
-- Add index for better performance when querying admin investments
CREATE INDEX IF NOT EXISTS idx_funding_requests_investor_id ON funding_requests(investor_id);
CREATE INDEX IF NOT EXISTS idx_funding_requests_status ON funding_requests(status);

-- Add a check to ensure admin can invest
ALTER TABLE funding_requests 
ADD CONSTRAINT check_admin_investor 
CHECK (investor_id = 'admin' OR investor_id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

-- Add approved_at column to applications table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'applications' AND column_name = 'approved_at') THEN
        ALTER TABLE applications ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Update approved_at for existing approved applications
UPDATE applications 
SET approved_at = updated_at 
WHERE status = 'approved' AND approved_at IS NULL;

-- Create a trigger to automatically set approved_at when status changes to approved
CREATE OR REPLACE FUNCTION set_approved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        NEW.approved_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_approved_at ON applications;
CREATE TRIGGER trigger_set_approved_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION set_approved_at();