import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { DashInput } from '@/components/DashInput';
import { DashButton } from '@/components/DashButton';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function SignupPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthColor = (level: number) => {
    if (strength < level) return 'bg-black/10';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    
    if (!name || !email || !password) { 
      setError('Please fill in all fields'); 
      return; 
    }
    
    if (password.length < 8) { 
      setError('Password must be at least 8 characters'); 
      return; 
    }

    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
      });

      // Send the email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Redirect to verification page
      navigate('/verify-email');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0]?.longMessage || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-section flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Signup Card */}
        <div className="w-full bg-card rounded-[1.25rem] sm:rounded-[1.5rem] border-2 border-black p-8 sm:p-10 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Branding Inside Card */}
          <div className="flex flex-col items-center mb-3 sm:mb-4 text-center">
            <img 
              src="/Logo.svg" 
              alt="AurexonAI Logo" 
             className="h-36 sm:h-36 w-auto object-contain animate-in slide-in-from-top-2 duration-700" 
            />
          </div>

          <div className="mb-4 text-center">
            <div className="flex items-center justify-center gap-2 text-primary font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-1 opacity-70">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Network Expansion</span>
            </div>
            <h2 className="text-sm font-black font-heading text-black tracking-widest uppercase opacity-70">Create Identity</h2>
            <div className="h-px w-8 bg-black/10 mx-auto mt-1.5" />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-[10px] font-bold p-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DashInput label="Full Name" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} className="bg-bg-section/20 h-9 border-black/10 focus:border-black" />
              <DashInput label="Email Address" type="email" placeholder="your@gmail.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-bg-section/20 h-9 border-black/10 focus:border-black" />
            </div>
            
            <DashInput label="Password" type="password" placeholder="••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-bg-section/20 h-9 border-black/10 focus:border-black" />

            {password.length > 0 && (
              <div className="space-y-1 mt-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-muted-foreground">Password Strength</span>
                  <span className={strength >= 3 ? 'text-green-600' : strength === 2 ? 'text-blue-600' : 'text-red-500'}>
                    {getStrengthText()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`rounded-full transition-colors duration-300 ${getStrengthColor(level)}`} />
                  ))}
                </div>
              </div>
            )}

            <DashButton 
              type="submit" 
              disabled={loading}
              className="w-full h-11 sm:h-12 text-xs sm:text-sm flex items-center justify-center gap-2 group mt-4 border-2 border-black bg-accent hover:bg-accent text-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-[3px] hover:translate-y-[3px] font-black uppercase tracking-[0.15em] transition-all"
            >
              {loading ? 'Processing...' : 'Register Node'}
              {!loading && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
            </DashButton>
          </form>

          <div className="mt-4 pt-4 border-t border-black/5 flex flex-col items-center">
            <p className="text-[10px] text-muted-foreground font-body">
              Identity exists? <Link to="/login" className="text-black font-black hover:underline underline-offset-4 decoration-accent decoration-2">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
