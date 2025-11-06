import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  Target, 
  Users, 
  Globe, 
  Award,
  BookOpen,
  ArrowRight,
  Heart,
  Lightbulb,
  Shield
} from "lucide-react";

export default function About() {
  const ayushSystems = [
    {
      name: "Ayurveda",
      description: "Ancient Indian system of medicine focusing on holistic healing through herbs, diet, and lifestyle.",
      icon: <Leaf className="h-8 w-8 text-green-600" />
    },
    {
      name: "Yoga & Naturopathy",
      description: "Physical, mental, and spiritual practices combined with natural healing methods.",
      icon: <Heart className="h-8 w-8 text-blue-600" />
    },
    {
      name: "Unani",
      description: "Traditional medicine system based on the teachings of Hippocrates and Arab physicians.",
      icon: <BookOpen className="h-8 w-8 text-purple-600" />
    },
    {
      name: "Siddha",
      description: "Ancient Tamil system of medicine using minerals, metals, and herbs for treatment.",
      icon: <Award className="h-8 w-8 text-orange-600" />
    },
    {
      name: "Homeopathy",
      description: "System of alternative medicine based on the principle of 'like cures like'.",
      icon: <Lightbulb className="h-8 w-8 text-indigo-600" />
    }
  ];

  const objectives = [
    {
      icon: <Target className="h-6 w-6 text-ayush-green" />,
      title: "Promote Traditional Medicine",
      description: "Encourage innovation and entrepreneurship in traditional Indian medicine systems"
    },
    {
      icon: <Users className="h-6 w-6 text-ayush-green" />,
      title: "Support Entrepreneurs",
      description: "Provide platform and resources for AYUSH-based startup registration and growth"
    },
    {
      icon: <Globe className="h-6 w-6 text-ayush-green" />,
      title: "Global Reach",
      description: "Help Indian traditional medicine reach global markets through modern business models"
    },
    {
      icon: <Shield className="h-6 w-6 text-ayush-green" />,
      title: "Quality Assurance",
      description: "Ensure compliance with regulations and maintain quality standards in AYUSH products"
    }
  ];

  const benefits = [
    "Official government recognition and certification",
    "Access to exclusive funding opportunities and grants",
    "Regulatory guidance and compliance support",
    "Networking with industry experts and mentors",
    "Marketing and promotional support",
    "Research and development assistance",
    "Export facilitation and international market access",
    "Tax benefits and incentives for AYUSH startups"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-ayush-light to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              About Healthcare Registration Portal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Empowering Traditional Medicine{" "}
              <span className="text-primary">Innovation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our portal promotes the development and recognition of traditional 
              healthcare systems, fostering innovation while preserving ancient wisdom.
            </p>
            <div className="flex justify-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Registered Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Portal Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Healthcare Registration Portal
              </h2>
              <p className="text-lg text-muted-foreground">
                Our digital platform streamlines the registration process for traditional 
                healthcare businesses and wellness startups, providing comprehensive 
                services from documentation to investment opportunities.
              </p>
              <p className="text-muted-foreground">
                We bridge the gap between traditional medicine practitioners and modern 
                business infrastructure, ensuring compliance with regulations while 
                fostering innovation in the healthcare sector.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Online Support</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Medicine Systems</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Traditional medicine herbs and modern technology" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-8 text-white">
                  <Leaf className="h-12 w-12 mb-4" />
                  <h3 className="text-xl font-bold">Traditional Wisdom</h3>
                  <p className="text-primary-foreground/80">
                    Modern platform for ancient healing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Gallery */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and services for healthcare business registration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Document verification process" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">Document Verification</h3>
                    <p className="text-sm text-white/80">Secure and efficient document processing</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Investment opportunities" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">Investment Platform</h3>
                    <p className="text-sm text-white/80">Connect with potential investors</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Business networking" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">Business Networking</h3>
                    <p className="text-sm text-white/80">Build valuable industry connections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Systems Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Healthcare Systems We Support</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Five traditional systems of medicine that form the foundation of holistic healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ayushSystems.map((system, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 w-fit group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                    {system.icon}
                  </div>
                  <CardTitle className="text-xl">{system.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {system.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Traditional Medicine Showcase */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Ancient Wisdom, Modern Application</h3>
              <p className="text-muted-foreground">
                Our platform bridges thousands of years of traditional healing knowledge 
                with contemporary business practices, creating opportunities for 
                practitioners to reach wider audiences while maintaining authenticity.
              </p>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-muted-foreground">Years of Tradition</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Certified Practitioners</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Traditional herbs and medicines" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white">
                <Leaf className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Our Objectives</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Working towards the advancement of traditional medicine through modern approaches
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {objectives.map((objective, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-lg bg-ayush-light">
                    {objective.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{objective.title}</h3>
                    <p className="text-muted-foreground">{objective.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container relative">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Registration Benefits</h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Exclusive advantages for registered healthcare businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg backdrop-blur hover:bg-white/20 transition-colors">
                <div className="w-2 h-2 rounded-full bg-white flex-shrink-0"></div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* Success Stories Preview */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8">Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">AyurTech Solutions</h4>
                <p className="text-sm text-primary-foreground/80">Scaled from local practice to national presence</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">Wellness Connect</h4>
                <p className="text-sm text-primary-foreground/80">Connected 1000+ patients with practitioners</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">HerbalGlobal</h4>
                <p className="text-sm text-primary-foreground/80">Expanded to international markets</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-muted/50 to-background border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-5"></div>
            <CardContent className="py-12 text-center space-y-6 relative">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Join the Healthcare Innovation Ecosystem?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  Register your healthcare business today and become part of the 
                  traditional medicine revolution with modern digital infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Button asChild size="lg" className="text-lg px-8">
                    <Link to="/auth-selection">
                      Start Registration <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                    <Link to="/auth-selection">View Dashboard</Link>
                  </Button>
                </div>
                
                {/* Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border/50">
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Secure Platform</div>
                    <div className="text-xs text-muted-foreground">Bank-level security</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Certified Process</div>
                    <div className="text-xs text-muted-foreground">Government approved</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Expert Support</div>
                    <div className="text-xs text-muted-foreground">24/7 assistance</div>
                  </div>
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Global Reach</div>
                    <div className="text-xs text-muted-foreground">International markets</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}