import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAadhaarAuth } from "@/hooks/useAadhaarAuth";
import { Loader2, Shield, Smartphone } from "lucide-react";

interface AadhaarAuthProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
  additionalData?: {
    fullName: string;
    email: string;
    password: string;
  };
}

export function AadhaarAuth({ mode, onSuccess, additionalData }: AadhaarAuthProps) {
  const [step, setStep] = useState<'aadhaar' | 'otp'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { isLoading, sendOTP, signUpWithAadhaar, signInWithAadhaar } = useAadhaarAuth();

  const handleSendOTP = async () => {
    const result = await sendOTP(aadhaarNumber);
    if (result.success) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    if (mode === 'signup' && additionalData) {
      const result = await signUpWithAadhaar(
        aadhaarNumber,
        otp,
        additionalData.fullName,
        additionalData.email,
        additionalData.password
      );
      if (result.success) {
        onSuccess?.();
      }
    } else if (mode === 'signin') {
      const result = await signInWithAadhaar(aadhaarNumber, otp);
      if (result.success) {
        onSuccess?.();
      }
    }
  };

  const formatAadhaarNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 12 digits
    const limited = digits.slice(0, 12);
    // Format as XXXX XXXX XXXX
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarNumber(e.target.value);
    setAadhaarNumber(formatted.replace(/\s/g, ''));
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-ayush-green/10">
          <Shield className="h-6 w-6 text-ayush-green" />
        </div>
        <CardTitle>
          {mode === 'signup' ? 'Register with Aadhaar' : 'Sign in with Aadhaar'}
        </CardTitle>
        <CardDescription>
          {step === 'aadhaar' 
            ? 'Enter your 12-digit Aadhaar number to receive OTP'
            : 'Enter the OTP sent to your registered mobile number'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'aadhaar' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                type="text"
                placeholder="1234 5678 9012"
                value={formatAadhaarNumber(aadhaarNumber)}
                onChange={handleAadhaarChange}
                maxLength={14} // Including spaces
                required
              />
              <p className="text-xs text-muted-foreground">
                Your Aadhaar number is encrypted and stored securely
              </p>
            </div>
            <Button 
              onClick={handleSendOTP}
              className="w-full bg-ayush-green hover:bg-ayush-green/90"
              disabled={isLoading || aadhaarNumber.length !== 12}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                OTP sent to mobile number linked with Aadhaar ****{aadhaarNumber.replace(/[^0-9]/g, '').slice(-4)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('aadhaar')}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerifyOTP}
                className="flex-1 bg-ayush-green hover:bg-ayush-green/90"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full text-sm"
            >
              Resend OTP
            </Button>
          </>
        )}
        
        <div className="text-center">
          <Separator className="my-4" />
          <p className="text-xs text-muted-foreground">
            Powered by Aadhaar Authentication System
          </p>
        </div>
      </CardContent>
    </Card>
  );
}