import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Shield, Users, Award, CheckCircle, Globe } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-700" />,
      title: "Healthcare Innovation",
      description: "Specialized platform for traditional healthcare businesses and wellness startups."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-700" />,
      title: "Secure Processing",
      description: "Government-backed registration system with encrypted data protection."
    },
    {
      icon: <Users className="h-8 w-8 text-green-700" />,
      title: "Business Network",
      description: "Connect with entrepreneurs and access professional development resources."
    },
    {
      icon: <Award className="h-8 w-8 text-green-700" />,
      title: "Official Certification",
      description: "Receive government certification and regulatory compliance support."
    }
  ];

  const benefits = [
    "Fast-track registration process",
    "Access to government schemes and funding",
    "Industry mentorship and guidance",
    "Networking opportunities",
    "Regulatory compliance support",
    "Market access facilitation"
  ];

  const stats = [
    { number: "500+", label: "Registered Startups" },
    { number: "₹50Cr+", label: "Funding Facilitated" },
    { number: "25+", label: "States Covered" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Government Healthcare Initiative
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Launch Your{" "}
              <span className="text-green-700">Healthcare Startup</span>{" "}
              Today
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Digital registration platform for traditional healthcare businesses. 
              Streamlined approval process with government certification and funding access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/auth-selection">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                <div className="text-green-100 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Platform Advantages</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Efficient digital workflow designed for healthcare business registration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Accelerate Business Growth
              </h2>
              <p className="text-lg text-muted-foreground">
                Registration provides access to funding opportunities and 
                professional development in the healthcare sector.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-700 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg">
                <Link to="/auth-selection">Get Started Now</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-700 to-green-600 rounded-2xl p-8 text-white">
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                  <Leaf className="h-16 w-16" />
                  <h3 className="text-2xl font-bold">Start Your Journey</h3>
                  <p className="text-green-100">
                    Transform healthcare through innovative business solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-green-700 to-green-600 text-white border-0">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Register Your Healthcare Business?
              </h2>
              <p className="text-xl text-green-100 max-w-2xl mx-auto">
                Join successful entrepreneurs who have registered their 
                healthcare businesses through our platform.
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/auth-selection">
                  Begin Registration Process <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}