import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { postNewsletter } from "@/lib/api";
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
  Stethoscope,
  FlaskConical,
  Brain,
  Building,
  UserCog,
  HeartPulse,
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

const dashboards = [
  { icon: Building, title: "Admin Portal", desc: "System control & user management", path: "/admin/dashboard", color: "bg-primary/10 text-primary" },
  { icon: Stethoscope, title: "Doctor Dashboard", desc: "Clinical care & consultations", path: "/doctor/dashboard", color: "bg-info/10 text-info" },
  { icon: HeartPulse, title: "Nurse Station", desc: "Patient care & vitals", path: "/nurse/dashboard", color: "bg-success/10 text-success" },
  { icon: FlaskConical, title: "Laboratory", desc: "Test orders & results", path: "/lab/dashboard", color: "bg-warning/10 text-warning" },
  { icon: Brain, title: "AI Analytics", desc: "Predictive insights", path: "/ai/dashboard", color: "bg-accent/10 text-accent" },
  { icon: UserCog, title: "Management", desc: "KPIs & reports", path: "/management/dashboard", color: "bg-secondary text-secondary-foreground" },
];

const Landing = () => {
  function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!email) return toast({ title: 'Please enter an email' });
      setLoading(true);
      try {
        await postNewsletter(email);
        toast({ title: 'Subscribed', description: 'Check your inbox for a welcome email.' });
        setEmail("");
      } catch (err) {
        toast({ title: 'Subscription failed', description: err?.message || 'Try again later.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
          aria-label="Email"
        />
        <Button type="submit" className="btn-gradient" disabled={loading}>
          {loading ? 'Sending...' : 'Start Free'}
        </Button>
      </form>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-lg sm:text-xl font-bold">SmartCare360</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#dashboards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portals</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="btn-gradient text-xs sm:text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full opacity-10 blur-3xl" style={{ background: "var(--gradient-secondary)" }} />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center stagger-children">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              Transforming Healthcare in Kenya
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Modern Healthcare
              <span className="text-gradient"> Management</span>
              <br />Made Simple
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              SmartCare360 streamlines your clinic operations with powerful EMR, 
              seamless payments, and intelligent analytics—all in one platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/signup">
                <Button size="lg" className="btn-gradient gap-2 w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Video className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 sm:p-6 rounded-2xl bg-card border border-border card-hover">
                <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Run Your Clinic
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              A comprehensive suite of tools designed specifically for healthcare providers in Kenya.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-border/50 bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboards Section */}
      <section id="dashboards" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Role-Based Dashboards
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Specialized interfaces for every role in your healthcare facility—from administrators to community health workers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {dashboards.map((dashboard, index) => (
              <Link key={index} to={dashboard.path}>
                <Card className="card-hover border-border/50 bg-card h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 ${dashboard.color}`}>
                      <dashboard.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-1">{dashboard.title}</h3>
                    <p className="text-sm text-muted-foreground">{dashboard.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-4">Plus 7 more specialized portals for complete healthcare management</p>
            <Link to="/login">
              <Button variant="outline" className="gap-2">
                Explore All Portals
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 sm:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-success/10 text-success text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                Enterprise-Grade Security
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Your Data is Safe With Us
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                We take healthcare data security seriously. SmartCare360 is built with 
                industry-leading security practices to keep your patient data protected.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  "End-to-end TLS and AES-256 encryption",
                  "Role-based access control (RBAC)",
                  "Automatic backups and disaster recovery",
                  "Compliant with Kenya Data Protection Act",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-success" />
                    </div>
                    <span className="text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow">
                  <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Trusted by Healthcare Leaders
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              See what medical professionals across Kenya are saying about SmartCare360.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover border-border/50 bg-card">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 sm:mb-6 italic text-sm sm:text-base">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm sm:text-base">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">{testimonial.author}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
            <div className="absolute inset-0 bg-hero-pattern opacity-10" />
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Healthcare Practice?
              </h2>
              <p className="text-white/80 mb-6 sm:mb-8 text-sm sm:text-base">
                Join hundreds of clinics already using SmartCare360 to deliver better patient care.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-foreground hover:bg-white/90 gap-2 w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Have questions? Our team is here to help you find the right solution for your healthcare facility.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Phone</div>
                    <div className="font-medium text-sm sm:text-base">+254 700 000 000</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Email</div>
                    <div className="font-medium text-sm sm:text-base">hello@smartcare360.co.ke</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Office</div>
                    <div className="font-medium text-sm sm:text-base">Westlands, Nairobi, Kenya</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-display text-lg sm:text-xl font-semibold mb-4">Send us a message</h3>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facility Name</label>
                    <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Your clinic or hospital" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[100px] text-sm" placeholder="Tell us about your needs..." />
                  </div>
                  <Button className="w-full btn-gradient">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-bold">SmartCare360</div>
                  <div className="text-sm text-muted-foreground">Modern healthcare management built for clinics in Africa.</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="text-sm text-muted-foreground">Trusted by</div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded bg-muted text-xs">Nairobi Health</div>
                  <div className="px-3 py-1 rounded bg-muted text-xs">Kisumu Clinic</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#features" className="hover:underline">Features</a></li>
                <li><a href="/pricing" className="hover:underline">Pricing</a></li>
                <li><a href="#dashboards" className="hover:underline">Portals</a></li>
                <li><a href="/telemedicine" className="hover:underline">Telemedicine</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li><a href="#testimonials" className="hover:underline">Case Studies</a></li>
                <li><a href="#contact" className="hover:underline">Contact Sales</a></li>
                <li><a href="#" className="hover:underline">Docs</a></li>
                <li><a href="#" className="hover:underline">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Get started</h4>
              <p className="text-sm text-muted-foreground mb-3">Start a free 30-day trial — no credit card required.</p>
              <form
                className="flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                }}
              >
                <NewsletterForm />
              </form>
              <div className="text-xs text-muted-foreground mt-3">Or call <strong>+254 700 000 000</strong> to speak with sales.</div>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">© 2026 SmartCare360. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA banner */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl shadow-lg">
          <div className="hidden sm:block">
            <div className="font-semibold">Start delivering better care today</div>
            <div className="text-sm opacity-90">Free 30-day trial • Onboarding included</div>
          </div>
          <Link to="/signup">
            <Button className="ml-2">Start Free Trial</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
