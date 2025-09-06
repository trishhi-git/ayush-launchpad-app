import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Shield, Users, Award, CheckCircle, Globe } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-ayush-green" />,
      title: "Traditional Medicine Focus",
      description: "Specialized portal for AYUSH-based startups promoting traditional Indian medicine systems."
    },
    {
      icon: <Shield className="h-8 w-8 text-ayush-green" />,
      title: "Government Approved",
      description: "Official registration platform backed by Ministry of AYUSH, Government of India."
    },
    {
      icon: <Users className="h-8 w-8 text-ayush-green" />,
      title: "Community Support",
      description: "Connect with like-minded entrepreneurs and access mentorship programs."
    },
    {
      icon: <Award className="h-8 w-8 text-ayush-green" />,
      title: "Certification & Recognition",
      description: "Get official recognition and certification for your AYUSH startup."
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
      <section className="relative py-20 bg-gradient-to-br from-ayush-light to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Ministry of AYUSH Initiative
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Register Your{" "}
              <span className="text-ayush-green">AYUSH Startup</span>{" "}
              Today
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Official government portal for registering startups in Ayurveda, Yoga, Unani, 
              Siddha, and Homeopathy. Get certified, access funding, and join India's 
              traditional medicine revolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/register">
                  Start Registration <ArrowRight className="ml-2 h-5 w-5" />
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
      <section className="py-16 bg-ayush-green text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                <div className="text-ayush-light text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Portal?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamlined registration process designed specifically for AYUSH startups
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-ayush-light w-fit">
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
                Unlock Your Startup's Potential
              </h2>
              <p className="text-lg text-muted-foreground">
                Registration opens doors to exclusive benefits and opportunities 
                in the traditional medicine ecosystem.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-ayush-green flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg">
                <Link to="/register">Get Started Now</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-ayush-green to-ayush-accent rounded-2xl p-8 text-white">
                <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                  <Leaf className="h-16 w-16" />
                  <h3 className="text-2xl font-bold">Join the Movement</h3>
                  <p className="text-ayush-light">
                    Be part of India's traditional medicine renaissance
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
          <Card className="bg-gradient-to-r from-ayush-green to-ayush-accent text-white border-0">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Register Your AYUSH Startup?
              </h2>
              <p className="text-xl text-ayush-light max-w-2xl mx-auto">
                Join hundreds of successful entrepreneurs who have already 
                registered their traditional medicine startups with us.
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/register">
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