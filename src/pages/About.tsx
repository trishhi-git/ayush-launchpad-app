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
      <section className="py-20 bg-gradient-to-br from-ayush-light to-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              About AYUSH Ministry
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Empowering Traditional Medicine{" "}
              <span className="text-ayush-green">Innovation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The Ministry of AYUSH promotes the development and recognition of traditional 
              Indian systems of medicine, fostering innovation while preserving ancient wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* About Ministry Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ministry of AYUSH
              </h2>
              <p className="text-lg text-muted-foreground">
                Established in 2014, the Ministry of AYUSH (Ayurveda, Yoga and Naturopathy, 
                Unani, Siddha, and Homeopathy) is dedicated to the development of education 
                and research in these traditional systems of medicine.
              </p>
              <p className="text-muted-foreground">
                Our mission is to promote, develop, and propagate AYUSH systems of healthcare 
                and to ensure optimal development and propagation of the potential of Indian 
                systems of medicine by developing suitable policies and programs.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-ayush-light rounded-lg">
                  <div className="text-2xl font-bold text-ayush-green">2014</div>
                  <div className="text-sm text-muted-foreground">Ministry Established</div>
                </div>
                <div className="p-4 bg-ayush-light rounded-lg">
                  <div className="text-2xl font-bold text-ayush-green">5</div>
                  <div className="text-sm text-muted-foreground">Medicine Systems</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-ayush-green to-ayush-accent rounded-2xl p-8 text-white">
                <div className="h-full flex flex-col justify-center items-center text-center space-y-6">
                  <Leaf className="h-20 w-20" />
                  <h3 className="text-2xl font-bold">Traditional Wisdom</h3>
                  <p className="text-ayush-light">
                    Bridging ancient knowledge with modern innovation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AYUSH Systems Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">AYUSH Systems of Medicine</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Five traditional systems of medicine that form the foundation of holistic healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ayushSystems.map((system, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-background w-fit">
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
      <section className="py-20 bg-ayush-green text-white">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Registration Benefits</h2>
            <p className="text-xl text-ayush-light max-w-2xl mx-auto">
              Exclusive advantages for registered AYUSH startups
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white/10 rounded-lg backdrop-blur">
                <div className="w-2 h-2 rounded-full bg-ayush-accent flex-shrink-0"></div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-ayush-light to-background border-ayush-green/20">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Join the AYUSH Ecosystem?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Register your startup today and become part of India's traditional 
                medicine revolution backed by government support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/register">
                    Start Registration <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}