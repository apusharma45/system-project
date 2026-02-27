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
  Stethoscope,
  Activity,
  Shield,
  Clock,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrate with backend auth API
    console.log("Login attempt:", { email, password });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/20" />
          <div className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/15" />
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
              Your Health, Our Priority
            </h1>
            <p className="text-teal-100 text-lg max-w-md">
              A seamless healthcare platform connecting patients, doctors,
              pharmacies, and diagnostic centers.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-sm">Expert Doctors</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-sm">24/7 Available</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-sm">Real-time Updates</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-teal-200 text-sm">
          <Users className="w-4 h-4" />
          <span>Trusted by 10,000+ healthcare professionals</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-teal-50/30">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Sign in to access your healthcare dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-teal-600 hover:text-teal-700 font-medium hover:underline"
                >
                  Create account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
