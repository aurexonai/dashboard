import { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { DashInput } from '@/components/DashInput';
import { DashButton } from '@/components/DashButton';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        navigate('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors[0]?.longMessage || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-bg-section flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
        
        <div className="w-full bg-card rounded-[1.25rem] sm:rounded-[1.5rem] border-2 border-black p-8 sm:p-10 shadow-[6px_6px_0px_0px_#000000] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col items-center mb-5 sm:mb-6 text-center">
            <img 
              src="/Logo.svg" 
              alt="AurexonAI Logo" 
              className="h-32 sm:h-36 w-auto object-contain animate-in slide-in-from-top-2 duration-700" 
            />
          </div>

          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-primary font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-1.5 opacity-70">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Identity Verification</span>
            </div>
            <h2 className="text-sm font-black font-heading text-black tracking-widest uppercase opacity-70">Verify Email</h2>
            <div className="h-px w-8 bg-black/10 mx-auto mt-2" />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive text-[10px] font-bold p-3 rounded-lg mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-3.5">
            <DashInput 
              label="Verification Code" 
              placeholder="Enter 6-digit code" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="bg-bg-section/20 h-9 border-black/10 focus:border-black" 
            />
            
            <DashButton 
              type="submit" 
              disabled={loading}
              className="w-full h-11 sm:h-12 text-xs sm:text-sm flex items-center justify-center gap-2 group mt-6 border-2 border-black bg-accent hover:bg-accent text-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-[3px] hover:translate-y-[3px] font-black uppercase tracking-[0.15em] transition-all"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
              {!loading && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
            </DashButton>
          </form>
        </div>
      </div>
    </div>
  );
}
