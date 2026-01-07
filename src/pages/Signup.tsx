import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  User,
  Mail,
  Lock,
  Building,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const facilityTypes = [
  "Private Clinic",
  "Public Hospital",
  "Pharmacy",
  "Dental Clinic",
  "Diagnostic Center",
  "Other",
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facilityName: "",
    facilityType: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.facilityType) {
      toast({
        title: "Facility type required",
        description: "Please select your facility type.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://smartcare360-jyho.onrender.com/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phone,
            facilityName: formData.facilityName,
            facilityType: formData.facilityType,
            role: "admin",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Store auth data
      localStorage.setItem("smartcare_token", data.token);
      localStorage.setItem("smartcare_user", JSON.stringify(data.user));

      toast({
        title: "Account created successfully 🎉",
        description: "Welcome to SmartCare360!",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-destructive",
    "bg-warning",
    "bg-info",
    "bg-success",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center pb-0">
              <CardTitle className="font-display text-2xl">
                Create Your Account
              </CardTitle>
              <CardDescription>
                Start your 14-day free trial today
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleChange("lastName", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>

                {/* Facility */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Facility Name</Label>
                    <Input
                      value={formData.facilityName}
                      onChange={(e) =>
                        handleChange("facilityName", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Facility Type</Label>
                    <Select
                      onValueChange={(v) =>
                        handleChange("facilityType", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleChange("password", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Confirm */}
                <div>
                  <Label>Confirm Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2">
                  <Checkbox required />
                  <span className="text-sm">I agree to the Terms</span>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <h1 className="text-4xl font-bold">SmartCare360</h1>
      </div>
    </div>
  );
};

export default Signup;
