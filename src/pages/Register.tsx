import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Building, User, FileText, CheckCircle } from "lucide-react";

const formSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyType: z.string().min(1, "Please select company type"),
  ayushCategory: z.string().min(1, "Please select AYUSH category"),
  registrationNumber: z.string().optional(),
  foundedYear: z.string().min(4, "Please enter valid year"),
  
  // Founder Information
  founderName: z.string().min(2, "Founder name must be at least 2 characters"),
  founderEmail: z.string().email("Please enter valid email"),
  founderPhone: z.string().min(10, "Please enter valid phone number"),
  founderQualification: z.string().min(1, "Please select qualification"),
  
  // Business Details
  businessModel: z.string().min(1, "Please select business model"),
  productDescription: z.string().min(50, "Product description must be at least 50 characters"),
  targetMarket: z.string().min(10, "Please describe target market"),
  fundingStage: z.string().min(1, "Please select funding stage"),
  
  // Address
  address: z.string().min(10, "Please enter complete address"),
  city: z.string().min(2, "Please enter city"),
  state: z.string().min(1, "Please select state"),
  pincode: z.string().min(6, "Please enter valid pincode"),
  
  // Legal
  termsAccepted: z.boolean().refine((val) => val === true, "You must accept terms and conditions"),
  privacyAccepted: z.boolean().refine((val) => val === true, "You must accept privacy policy"),
});

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const [currentTab, setCurrentTab] = useState("company");
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyType: "",
      ayushCategory: "",
      registrationNumber: "",
      foundedYear: "",
      founderName: "",
      founderEmail: "",
      founderPhone: "",
      founderQualification: "",
      businessModel: "",
      productDescription: "",
      targetMarket: "",
      fundingStage: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data);
    toast({
      title: "Registration Submitted Successfully!",
      description: "Your application is being reviewed. You'll receive confirmation within 48 hours.",
    });
  };

  const tabs = [
    { id: "company", label: "Company", icon: <Building className="h-4 w-4" /> },
    { id: "founder", label: "Founder", icon: <User className="h-4 w-4" /> },
    { id: "business", label: "Business", icon: <FileText className="h-4 w-4" /> },
    { id: "submit", label: "Submit", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  const getProgress = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    return ((currentIndex + 1) / tabs.length) * 100;
  };

  const nextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  const prevTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-ayush-light to-background">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-8">
          <Badge variant="secondary" className="mb-2">AYUSH Startup Registration</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Register Your Startup</h1>
          <p className="text-muted-foreground">
            Complete the registration process to join the AYUSH startup ecosystem
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="space-y-4">
              <Progress value={getProgress()} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {tabs.findIndex(tab => tab.id === currentTab) + 1} of {tabs.length}</span>
                <span>{Math.round(getProgress())}% Complete</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-8">
                    {tabs.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Company Information Tab */}
                  <TabsContent value="company" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Company Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="companyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Type *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select company type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pvt-ltd">Private Limited</SelectItem>
                                  <SelectItem value="llp">Limited Liability Partnership</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                                  <SelectItem value="section-8">Section 8 Company</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ayushCategory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>AYUSH Category *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select AYUSH category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ayurveda">Ayurveda</SelectItem>
                                  <SelectItem value="yoga">Yoga & Naturopathy</SelectItem>
                                  <SelectItem value="unani">Unani</SelectItem>
                                  <SelectItem value="siddha">Siddha</SelectItem>
                                  <SelectItem value="homeopathy">Homeopathy</SelectItem>
                                  <SelectItem value="multiple">Multiple Categories</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="foundedYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Founded Year *</FormLabel>
                              <FormControl>
                                <Input placeholder="2024" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Registration Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter registration number (if available)" {...field} />
                            </FormControl>
                            <FormDescription>
                              Leave blank if not yet registered
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Founder Information Tab */}
                  <TabsContent value="founder" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Founder Information
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="founderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Founder Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter founder name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="founderEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="founder@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="founderPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="+91 XXXXXXXXXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="founderQualification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Educational Qualification *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select highest qualification" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bams">BAMS (Bachelor of Ayurvedic Medicine)</SelectItem>
                                <SelectItem value="bhms">BHMS (Bachelor of Homeopathic Medicine)</SelectItem>
                                <SelectItem value="bums">BUMS (Bachelor of Unani Medicine)</SelectItem>
                                <SelectItem value="bsms">BSMS (Bachelor of Siddha Medicine)</SelectItem>
                                <SelectItem value="bnaturo">Bachelor of Naturopathy & Yoga</SelectItem>
                                <SelectItem value="masters">Masters in AYUSH</SelectItem>
                                <SelectItem value="phd">PhD in AYUSH</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                                  <SelectItem value="karnataka">Karnataka</SelectItem>
                                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                                  <SelectItem value="kerala">Kerala</SelectItem>
                                  <SelectItem value="delhi">Delhi</SelectItem>
                                  <SelectItem value="gujarat">Gujarat</SelectItem>
                                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Business Details Tab */}
                  <TabsContent value="business" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Business Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessModel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Model *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select business model" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="b2c">B2C (Business to Consumer)</SelectItem>
                                  <SelectItem value="b2b">B2B (Business to Business)</SelectItem>
                                  <SelectItem value="b2b2c">B2B2C (Business to Business to Consumer)</SelectItem>
                                  <SelectItem value="marketplace">Marketplace</SelectItem>
                                  <SelectItem value="saas">SaaS (Software as a Service)</SelectItem>
                                  <SelectItem value="clinic">Clinic/Healthcare Service</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="fundingStage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Funding Stage *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select funding stage" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                                  <SelectItem value="seed">Seed</SelectItem>
                                  <SelectItem value="series-a">Series A</SelectItem>
                                  <SelectItem value="series-b">Series B</SelectItem>
                                  <SelectItem value="growth">Growth Stage</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product/Service Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your product or service in detail..." 
                                className="min-h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Minimum 50 characters. Describe what your startup offers.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetMarket"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Market *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your target market and customer segments..." 
                                className="min-h-20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complete Address *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter complete business address..." 
                                className="min-h-20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem className="max-w-xs">
                            <FormLabel>Pincode *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter pincode" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Submit Tab */}
                  <TabsContent value="submit" className="space-y-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Review & Submit
                      </h3>
                      
                      <Card className="bg-ayush-light/50">
                        <CardHeader>
                          <CardTitle className="text-base">Application Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div>Company: <span className="font-medium">{form.watch("companyName") || "Not provided"}</span></div>
                          <div>Category: <span className="font-medium">{form.watch("ayushCategory") || "Not provided"}</span></div>
                          <div>Founder: <span className="font-medium">{form.watch("founderName") || "Not provided"}</span></div>
                          <div>Email: <span className="font-medium">{form.watch("founderEmail") || "Not provided"}</span></div>
                          <div>Business Model: <span className="font-medium">{form.watch("businessModel") || "Not provided"}</span></div>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="termsAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I accept the terms and conditions *
                                </FormLabel>
                                <FormDescription>
                                  By checking this box, you agree to our terms of service and registration policies.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="privacyAccepted"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I accept the privacy policy *
                                </FormLabel>
                                <FormDescription>
                                  You agree to our data handling and privacy practices.
                                </FormDescription>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        Submit Application
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={currentTab === "company"}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentTab !== "submit" && (
                    <Button
                      type="button"
                      onClick={nextTab}
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}