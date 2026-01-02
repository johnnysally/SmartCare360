import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Calendar,
  Users,
  CreditCard,
  Pill,
  Video,
  BarChart3,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Heart,
  Phone,
  Mail,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Patient Records",
    description: "Secure, centralized EMR accessible in real-time across all departments.",
    color: "text-primary",
  },
  {
    icon: Calendar,
    title: "Appointments",
    description: "Smart scheduling with automated reminders and queue management.",
    color: "text-info",
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Integrated M-Pesa and NHIF processing for seamless transactions.",
    color: "text-success",
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Track inventory, manage prescriptions, and prevent stockouts.",
    color: "text-warning",
  },
  {
    icon: Video,
    title: "Telemedicine",
    description: "Virtual consultations extending care to remote communities.",
    color: "text-secondary-foreground",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Real-time insights into clinic performance and patient trends.",
    color: "text-accent",
  },
];

const stats = [
  { value: "500+", label: "Healthcare Facilities" },
  { value: "2M+", label: "Patients Served" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const testimonials = [
  {
    quote: "SmartCare360 transformed how we manage our clinic. Patient wait times dropped by 60%.",
    author: "Dr. Wanjiru Kamau",
    role: "Medical Director, Nairobi Health Center",
    avatar: "WK",
  },
  {
    quote: "The M-Pesa integration alone saved us countless hours. Billing is now effortless.",
    author: "James Ochieng",
    role: "Administrator, Kisumu District Hospital",
    avatar: "JO",
  },
  {
    quote: "Finally, a system designed for African healthcare. It just works.",
    author: "Dr. Fatima Hassan",
    role: "CEO, Coastal Medical Group",
    avatar: "FH",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "KES 5,000",
    period: "/month",
    description: "Perfect for small clinics",
    features: [
      "Up to 500 patients",
      "Basic EMR",
      "Appointment scheduling",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "KES 15,000",
    period: "/month",
    description: "For growing healthcare facilities",
    features: [
      "Unlimited patients",
      "Full EMR suite",
      "M-Pesa & NHIF integration",
      "Pharmacy management",
      "Priority support",
      "Custom reports",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For hospitals & clinic chains",
    features: [
      "Multi-location support",
      "Telemedicine platform",
      "Advanced analytics",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    popular: false,
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">SmartCare360</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="btn-gradient">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--gradient-secondary)" }}
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Transforming Healthcare in Kenya
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Modern Healthcare
              <span className="text-gradient"> Management</span>
              <br />Made Simple
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              SmartCare360 streamlines your clinic operations with powerful EMR, 
              seamless payments, and intelligent analytics—all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="btn-gradient gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Video className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-card border border-border card-hover"
              >
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Run Your Clinic
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive suite of tools designed specifically for healthcare providers in Kenya.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Enterprise-Grade Security
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Your Data is Safe With Us
              </h2>
              <p className="text-muted-foreground mb-8">
                We take healthcare data security seriously. SmartCare360 is built with 
                industry-leading security practices to keep your patient data protected.
              </p>
              
              <div className="space-y-4">
                {[
                  "End-to-end TLS and AES-256 encryption",
                  "Role-based access control (RBAC)",
                  "Automatic backups and disaster recovery",
                  "Compliant with Kenya Data Protection Act",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                  <Shield className="w-16 h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what medical professionals across Kenya are saying about SmartCare360.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover border-border/50 bg-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your facility's needs. All plans include core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative card-hover ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${plan.popular ? "btn-gradient" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div 
            className="relative rounded-3xl p-12 md:p-20 overflow-hidden"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="absolute inset-0 bg-hero-pattern opacity-10" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Healthcare Practice?
              </h2>
              <p className="text-white/80 mb-8">
                Join hundreds of clinics already using SmartCare360 to deliver better patient care.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-foreground hover:bg-white/90 gap-2">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions? Our team is here to help you find the right solution for your healthcare facility.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium">+254 700 000 000</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">hello@smartcare360.co.ke</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Office</div>
                    <div className="font-medium">Westlands, Nairobi, Kenya</div>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="border-border/50">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="john@clinic.co.ke"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Facility Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Your Clinic Name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                      placeholder="Tell us about your needs..."
                    />
                  </div>
                  <Button className="w-full btn-gradient">
                    Send Message
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-bold">SmartCare360</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Transforming healthcare management across Kenya with modern, intuitive technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
                <li><a href="#" className="hover:text-foreground">Updates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
                <li><a href="#" className="hover:text-foreground">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Data Protection</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 SmartCare360. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">System Status: All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
