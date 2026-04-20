import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { DashInput } from '@/components/DashInput';
import { DashButton } from '@/components/DashButton';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    
    if (!email || !password) { 
      setError('Please fill in all fields'); 
      return; 
    }

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      } else {
        console.error(JSON.stringify(result, null, 2));
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0]?.longMessage || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  return (
    <div className="h-auto lg:h-screen xl:h-screen w-full bg-bg-section flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500">
        
        {/* Login Card */}
        <div className="w-full bg-card rounded-[1.25rem] sm:rounded-[1.5rem] border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Branding Inside Card */}
          <div className="flex flex-col items-center mb-2 sm:mb-3 text-center">
            <img 
              src="/Logo.svg" 
              alt="AurexonAI Logo" 
              className="h-36 sm:h-36 w-auto object-contain animate-in slide-in-from-top-2 duration-700" 
            />
          </div>

          <div className="mb-3 text-center">
            <h2 className="text-sm font-black font-heading text-black tracking-widest uppercase opacity-70">Security Gateway</h2>
            <div className="h-px w-8 bg-black/10 mx-auto mt-1 mb-1" />
            <p className="text-[10px] text-muted-foreground font-body leading-tight">Identity Verification Protocol 4.2</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-[10px] font-bold p-2 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2.5">
            <DashInput 
              label="Email Address" 
              type="email" 
              placeholder="your@gmail.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="bg-bg-section/20 h-10 border-black/10 focus:border-black"
            />
            <DashInput 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="bg-bg-section/20 h-10 border-black/10 focus:border-black"
            />

            <DashButton 
              type="submit" 
              disabled={loading}
              className="w-full h-11 sm:h-12 text-xs sm:text-sm flex items-center justify-center gap-2 group border-2 border-black bg-accent hover:bg-accent text-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-[3px] hover:translate-y-[3px] font-black uppercase tracking-[0.15em] transition-all"
            >
              {loading ? 'Authenticating...' : 'Login'}
              {!loading && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
            </DashButton>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
              <span className="bg-card px-3 text-muted-foreground">Or connect via</span>
            </div>
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full h-11 sm:h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center gap-3 text-xs sm:text-sm font-black uppercase tracking-wider shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-3 pt-3 border-t border-black/5 flex flex-col items-center">
            <p className="text-[10px] text-muted-foreground font-body">
              Unregistered? <Link to="/signup" className="text-black font-black hover:underline underline-offset-4 decoration-accent decoration-2">Create an Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
