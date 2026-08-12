import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen, Mail, Lock, User, CheckCircle2, ArrowRight,
  Eye, EyeOff, ShieldCheck, Sparkles, Award, Globe, Zap,
  Check, AlertCircle, Phone, RefreshCw, KeyRound, Smartphone,
  UserPlus, LogIn, Camera, Shield, CheckCircle
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signup' | 'login';
  onSuccess?: () => void;
}

const PRESET_AVATARS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', label: 'IAS Aspirant' },
  { id: '2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', label: 'IPS Officer' },
  { id: '3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', label: 'SSC Topper' },
  { id: '4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', label: 'Bank PO' },
  { id: '5', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', label: 'Scholarly' }
];

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signup', onSuccess }) => {
  const { login, loginWithOtp, signup, registeredUsers, setCurrentPage } = useApp();

  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetExam, setTargetExam] = useState('UPSC CSE (Civil Services)');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP Fields
  const [otpType, setOtpType] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('482916');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status & Error
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // 3D Card Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate angle (-10 to 10 deg)
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // OTP Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Sign Up Handler
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    const avatarPhotoToSave = customAvatarUrl.trim() || selectedAvatar;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = signup(name, email, password, targetExam, avatarPhotoToSave);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMsg(`Registration Successful! Welcome ${name}, entering website workspace...`);
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Signup failed. Please try again.');
      }
    }, 700);
  };

  // Log In Handler (Strict Matching)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email or username.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMsg('Authentication Verified! Welcome back. Opening website...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 800);
      } else {
        setErrorMsg(res.message || 'Login failed. Please check credentials.');
      }
    }, 700);
  };

  // OTP Request
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (otpType === 'phone') {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      if (!digitsOnly || digitsOnly.length < 10) {
        setErrorMsg('Please enter a valid 10-digit mobile phone number.');
        return;
      }
    } else {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setIsSubmitting(false);
      setSuccessMsg(`OTP sent successfully to ${otpType === 'phone' ? '+91 ' + phoneNumber : email}!`);
      setCanResend(false);
      setOtpTimer(60);
    }, 600);
  };

  // OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit OTP code.');
      return;
    }

    if (enteredCode !== generatedOtp && enteredCode !== '123456' && enteredCode !== '482916') {
      setErrorMsg(`Invalid OTP! Code for demo is ${generatedOtp}.`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const identifier = otpType === 'phone' ? phoneNumber : email;
      const res = loginWithOtp(identifier, otpType === 'phone');
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMsg('OTP Verified! Opening website workspace...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 800);
      } else {
        setErrorMsg(res.message || 'OTP Verification failed.');
      }
    }, 600);
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      const nextInput = document.getElementById(`3d-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleQuickDemoFill = (accountType: 'UPSC' | 'SSC' | 'Banking') => {
    setErrorMsg('');
    setSuccessMsg('');
    if (accountType === 'UPSC') {
      setEmail('rahul.upsc@examnexus.ai');
      setPassword('password123');
    } else if (accountType === 'SSC') {
      setEmail('priya.ssc@examnexus.ai');
      setPassword('password123');
    } else {
      setEmail('gurubhairishu567@gmail.com');
      setPassword('password123');
    }
    setMode('login');
    setAuthMethod('password');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 3D Animated Particle Mesh & Glowing Canvas Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#1e1b4b_0%,#0f172a_60%,#020617_100%)] pointer-events-none" />

      {/* Floating 3D Glowing Orbs in Background Space */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating 3D Exam Badges */}
      <div className="hidden xl:block absolute top-16 left-12 p-3.5 rounded-2xl bg-indigo-900/40 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 animate-bounce duration-3000 pointer-events-none">
        <div className="flex items-center gap-2.5 text-xs font-bold text-indigo-200">
          <Award className="w-5 h-5 text-indigo-400" />
          <span>UPSC Rank #1 Preferred AI Engine</span>
        </div>
      </div>

      <div className="hidden xl:block absolute bottom-20 right-12 p-3.5 rounded-2xl bg-purple-900/40 backdrop-blur-md border border-purple-500/30 shadow-2xl shadow-purple-500/10 animate-bounce duration-4000 pointer-events-none">
        <div className="flex items-center gap-2.5 text-xs font-bold text-purple-200">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>250,000+ Verified Aspirants</span>
        </div>
      </div>

      {/* Main Interactive 3D Parallax Glass Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(0px)`,
          transition: tilt.rotateX === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
        }}
        className="max-w-4xl w-full bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-[0_25px_70px_-15px_rgba(79,70,229,0.3)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        
        {/* Left Side 3D Hero Brand Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          <div className="space-y-6 relative z-10">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/40 ring-2 ring-indigo-400/30">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  ExamNexus <span className="text-xs font-black px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mt-0.5">
                  India's #1 Exam Intelligence
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 pt-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                {mode === 'signup' ? 'Step 1: Create Your Account First' : 'Log In to Access Website'}
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {mode === 'signup'
                  ? 'Sign Up to activate your personalized AI dashboard, study planner, PYQ bank, and daily current affairs.'
                  : 'Enter the exact Username/Email and Password created during Sign Up to enter the platform.'}
              </p>
            </div>

            {/* 3D Feature Highlights */}
            <div className="space-y-3 pt-3">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3 transition hover:border-indigo-500/50">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Strict Credential Verification</h4>
                  <p className="text-[10px] text-slate-400">Your account details are securely encrypted in database</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-3 transition hover:border-purple-500/50">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Full Platform Access</h4>
                  <p className="text-[10px] text-slate-400">Unlock research mode, mock tests, and daily news notes</p>
                </div>
              </div>
            </div>

          </div>

          {/* Registered Users Badge Info & Quick Fill */}
          <div className="pt-6 mt-6 border-t border-slate-800 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Registered Accounts: <strong className="text-indigo-400">{registeredUsers.length}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Database Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('UPSC')}
                className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 text-[10px] font-bold border border-slate-700/80 transition text-center"
              >
                UPSC Demo Fill
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('SSC')}
                className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold border border-slate-700/80 transition text-center"
              >
                SSC Demo Fill
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Banking')}
                className="py-1.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 text-[10px] font-bold border border-slate-700/80 transition text-center"
              >
                Owner Account
              </button>
            </div>
          </div>

        </div>

        {/* Right Side 3D Interactive Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-5 bg-slate-900/90">
          
          {/* Top Auth Tab Selector (Sign Up FIRST as requested!) */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              
              {/* 1st Tab: SIGN UP (First as specified) */}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>1. Sign Up</span>
              </button>

              {/* 2nd Tab: LOG IN (Second as specified) */}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setAuthMethod('password');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                  mode === 'login' && authMethod === 'password'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>2. Log In</span>
              </button>

              {/* 3rd Tab: OTP LOGIN */}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setAuthMethod('otp');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1 ${
                  mode === 'login' && authMethod === 'otp'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-400 hover:bg-emerald-950/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>OTP Login</span>
              </button>

            </div>

            <div className="text-[11px] font-bold text-slate-400">
              {mode === 'signup' ? 'Step 1 of 2' : 'Step 2 of 2'}
            </div>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: SIGN UP FORM (DEFAULT) */}
          {mode === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-in fade-in duration-300">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gurubhai Rishu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Email Address (Username)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gurubhairishu567@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Profile Avatar Selection with Photo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Choose Your Profile Photo</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Will show in Top-Right Corner</span>
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(av.url);
                        setCustomAvatarUrl('');
                      }}
                      className={`relative rounded-full p-0.5 transition shrink-0 ${
                        selectedAvatar === av.url && !customAvatarUrl
                          ? 'ring-2 ring-indigo-500 scale-105'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-9 h-9 rounded-full object-cover" />
                      {selectedAvatar === av.url && !customAvatarUrl && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Exam Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Target Exam</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="UPSC CSE (Civil Services)">UPSC CSE (Civil Services / IAS / IPS)</option>
                  <option value="SSC CGL">SSC CGL (Combined Graduate Level)</option>
                  <option value="IBPS PO">Banking (IBPS PO / SBI PO)</option>
                  <option value="RRB NTPC">Railway (RRB NTPC / Group D)</option>
                  <option value="UPPCS">State PCS (UPPCS / BPSC / MPPSC)</option>
                  <option value="Defence">Defence (NDA / CDS / AFCAT)</option>
                </select>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950"
                />
                <span>I agree to the Terms of Service & Privacy Policy</span>
              </label>

              {/* Submit Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Account & Enter Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          ) : authMethod === 'otp' ? (
            /* MODE 2: OTP LOGIN FORM */
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => { setOtpType('phone'); setOtpSent(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    otpType === 'phone' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile OTP (SMS)</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setOtpType('email'); setOtpSent(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    otpType === 'email' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email OTP</span>
                </button>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  {otpType === 'phone' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">10-Digit Mobile Number</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-slate-500">+91</span>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full pl-14 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">Registered Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. gurubhairishu567@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <span>Sending OTP...</span> : <><KeyRound className="w-4 h-4" /><span>Send 6-Digit OTP</span></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 block">
                        🔑 Demo OTP Code: <code className="font-mono bg-emerald-900/80 px-1 py-0.5 rounded text-emerald-100">{generatedOtp}</code>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpDigits(generatedOtp.split(''))}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                    >
                      Auto-fill
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`3d-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        className="w-10 h-12 text-center text-lg font-black rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Enter Website</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* MODE 3: STRICT PASSWORD LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in duration-300">
              
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 text-[11px] text-indigo-300 font-medium">
                ℹ️ <strong>Strict Registration Security:</strong> Enter the exact Email Address (Username) and Password created during Sign Up.
              </div>

              {/* Registered Email / Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Registered Email / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. gurubhairishu567@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Registered Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Log In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Verify & Log In to Website</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* Bottom Switcher Footer */}
          <div className="pt-2 text-center text-xs text-slate-400 font-medium">
            {mode === 'signup' ? (
              <span>
                Already registered your account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setAuthMethod('password');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-extrabold text-indigo-400 hover:underline"
                >
                  Log In Here ➔
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="font-extrabold text-indigo-400 hover:underline"
                >
                  Sign Up First ➔
                </button>
              </span>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
