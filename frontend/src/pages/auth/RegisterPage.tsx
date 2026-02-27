import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  User,
  Stethoscope,
  Building2,
  FlaskConical,
  Activity,
  CheckCircle2,
} from "lucide-react";

type Role = "PATIENT" | "DOCTOR" | "PHARMACY" | "DIAGNOSTIC";

const roles: {
  value: Role;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "PATIENT",
    label: "Patient",
    description: "Book appointments and receive prescriptions",
    icon: <User className="w-5 h-5" />,
  },
  {
    value: "DOCTOR",
    label: "Doctor",
    description: "Manage patients and issue prescriptions",
    icon: <Stethoscope className="w-5 h-5" />,
  },
  {
    value: "PHARMACY",
    label: "Pharmacy",
    description: "Receive and dispense prescriptions",
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    value: "DIAGNOSTIC",
    label: "Diagnostic Center",
    description: "Receive lab orders and upload results",
    icon: <FlaskConical className="w-5 h-5" />,
  },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "PATIENT" as Role,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setIsLoading(true);

    // TODO: Integrate with backend auth API
    console.log("Register attempt:", formData);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-teal-600 to-teal-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-32 right-10 w-40 h-40 rounded-full bg-white/20" />
          <div className="absolute bottom-20 left-20 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute top-1/3 right-1/3 w-20 h-20 rounded-full bg-white/15" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MediConnect</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join Our Healthcare Network
            </h1>
            <p className="text-cyan-100 text-lg max-w-md">
              Create your account and become part of a modern healthcare
              ecosystem designed for efficiency and care.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-cyan-300" />
              <span>Secure patient data management</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-cyan-300" />
              <span>Real-time appointment notifications</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-cyan-300" />
              <span>Digital prescriptions & lab results</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <CheckCircle2 className="w-5 h-5 text-cyan-300" />
              <span>Seamless pharmacy integration</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-cyan-200 text-sm">
          <p>Already helping thousands of healthcare providers deliver better care.</p>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-cyan-50/30 overflow-y-auto">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm my-8">
          <CardHeader className="space-y-1 pb-4">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-teal-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-teal-700">
                MediConnect
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Select your role and get started
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-gray-700">I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: role.value }))
                      }
                      className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                        formData.role === role.value
                          ? "border-teal-500 bg-teal-50 shadow-sm"
                          : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`mb-2 ${
                          formData.role === role.value
                            ? "text-teal-600"
                            : "text-gray-400"
                        }`}
                      >
                        {role.icon}
                      </div>
                      <div
                        className={`font-semibold text-sm ${
                          formData.role === role.value
                            ? "text-teal-700"
                            : "text-gray-700"
                        }`}
                      >
                        {role.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 leading-tight">
                        {role.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">
                    Confirm
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                type="submit"
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
