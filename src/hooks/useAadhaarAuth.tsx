import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AadhaarAuthHook {
  isLoading: boolean;
  sendOTP: (aadhaarNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (aadhaarNumber: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithAadhaar: (aadhaarNumber: string, otp: string, fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithAadhaar: (aadhaarNumber: string, otp: string) => Promise<{ success: boolean; error?: string }>;
}

export function useAadhaarAuth(): AadhaarAuthHook {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendOTP = async (aadhaarNumber: string) => {
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return { success: false, error: "Please enter a valid 12-digit Aadhaar number" };
    }

    setIsLoading(true);
    try {
      // Generate a 6-digit OTP using cryptographically secure random
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      const otpCode = (100000 + (array[0] % 900000)).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

      // Store OTP in database
      const { error } = await supabase
        .from('aadhaar_otp_verification')
        .insert({
          aadhaar_number: aadhaarNumber,
          otp_code: otpCode,
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // In a real implementation, this would send SMS via UIDAI API
      toast({
        title: "OTP Sent",
        description: `OTP sent to your registered mobile number. (Demo OTP: ${otpCode})`,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to send OTP. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (aadhaarNumber: string, otp: string) => {
    setIsLoading(true);
    try {
      // Verify OTP from database
      const { data, error } = await supabase
        .from('aadhaar_otp_verification')
        .select('*')
        .eq('aadhaar_number', aadhaarNumber)
        .eq('otp_code', otp)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return { success: false, error: "Invalid or expired OTP. Please try again." };
      }

      // Mark OTP as verified
      await supabase
        .from('aadhaar_otp_verification')
        .update({ verified: true })
        .eq('id', data.id);

      return { success: true };
    } catch (error) {
      return { success: false, error: "OTP verification failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithAadhaar = async (aadhaarNumber: string, otp: string, fullName: string, email: string, password: string) => {
    // First verify OTP
    const otpResult = await verifyOTP(aadhaarNumber, otp);
    if (!otpResult.success) {
      return otpResult;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            aadhaar_number: aadhaarNumber,
          },
        },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      // Update profile with Aadhaar information
      if (authData.user) {
        await supabase
          .from('profiles')
          .update({
            aadhaar_number: aadhaarNumber,
            aadhaar_verified: true,
            aadhaar_verified_at: new Date().toISOString()
          })
          .eq('user_id', authData.user.id);
      }

      toast({
        title: "Registration Successful!",
        description: "Your account has been created with Aadhaar verification.",
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: "Registration failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithAadhaar = async (aadhaarNumber: string, otp: string) => {
    // First verify OTP
    const otpResult = await verifyOTP(aadhaarNumber, otp);
    if (!otpResult.success) {
      return otpResult;
    }

    setIsLoading(true);
    try {
      // Find user by Aadhaar number
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email, user_id')
        .eq('aadhaar_number', aadhaarNumber)
        .eq('aadhaar_verified', true)
        .maybeSingle();

      if (profileError || !profileData) {
        return { success: false, error: "No verified account found with this Aadhaar number." };
      }

      // For demo purposes, we'll create a password-less sign-in
      // In a real implementation, this would use UIDAI's authentication
      toast({
        title: "Authentication Successful!",
        description: "Please complete sign-in with your email and password.",
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: "Authentication failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendOTP,
    verifyOTP,
    signUpWithAadhaar,
    signInWithAadhaar
  };
}