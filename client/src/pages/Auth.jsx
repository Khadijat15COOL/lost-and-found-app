import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, Mail, User, Key, GraduationCap, AlertCircle } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    user,
    login,
    register,
    isLoginPending,
    isRegisterPending,
  } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    matricNo: '',
    password: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    matricNo: '',
    gmail: '',
    password: '',
    confirmPassword: '',
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateSignup = () => {
    const errors = {};

    if (!signupForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }



    if (!signupForm.matricNo.trim()) {
      errors.matricNo = 'Matric number is required';
    }

    if (!signupForm.gmail.trim()) {
      errors.gmail = 'Gmail is required';
    } else if (!signupForm.gmail.includes('@gmail.com')) {
      errors.gmail = 'Please enter a valid Gmail address';
    }

    if (!signupForm.password) {
      errors.password = 'Password is required';
    } else if (signupForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginForm);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateSignup()) return;

    try {
      await register({
        fullName: signupForm.fullName,
        matricNo: signupForm.matricNo,
        gmail: signupForm.gmail,
        password: signupForm.password,
      });
      toast({
        title: "Account created!",
        description: "Welcome to FindIt! Your account has been created successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-md relative z-10">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50 backdrop-blur-sm">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                Student Login
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-matricNo" className="text-slate-300">Matric Number or Email</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="login-matricNo"
                      type="text"
                      placeholder="Enter matric number or email"
                      value={loginForm.matricNo}
                      onChange={(e) => setLoginForm({ ...loginForm, matricNo: e.target.value })}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  disabled={isLoginPending}
                >
                  {isLoginPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Log In'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-400" />
                Create Account
              </CardTitle>
              <CardDescription className="text-slate-400">
                Register with your student details
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 ${formErrors.fullName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.fullName}
                    </p>
                  )}
                </div>



                {/* Matric Number */}
                <div className="space-y-2">
                  <Label htmlFor="matricNo" className="text-slate-300">Matriculation Number</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="matricNo"
                      placeholder="2022/1234"
                      value={signupForm.matricNo}
                      onChange={(e) => setSignupForm({ ...signupForm, matricNo: e.target.value })}
                      className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 ${formErrors.matricNo ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.matricNo && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.matricNo}
                    </p>
                  )}
                </div>

                {/* Gmail */}
                <div className="space-y-2">
                  <Label htmlFor="gmail" className="text-slate-300">Gmail Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="gmail"
                      type="email"
                      placeholder="student@gmail.com"
                      value={signupForm.gmail}
                      onChange={(e) => setSignupForm({ ...signupForm, gmail: e.target.value })}
                      className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 ${formErrors.gmail ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.gmail && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.gmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="signup-password"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className={`pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 ${formErrors.password ? 'border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showSignupPassword ? "text" : "password"}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                  disabled={isRegisterPending}
                >
                  {isRegisterPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
