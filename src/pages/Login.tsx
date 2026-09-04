import { FormEvent, useState } from 'react';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { login, signup, type AuthUser } from '@/data/auth';

type Mode = 'login' | 'signup';

export default function Login({ onAuthenticated }: { onAuthenticated: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = mode === 'login' ? await login(email, password) : await signup(name, email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign you in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07090d] text-white flex items-center justify-center px-5 py-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(14,165,233,0.12),transparent_35%)]" />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.035] p-7 shadow-2xl shadow-black/30 sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-sky-400/10">
            <Sparkles size={18} className="text-sky-300" />
          </div>
          <div><p className="text-sm font-semibold">Horizon Works</p><p className="text-xs text-white/40">Demo Engine</p></div>
        </div>
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300/80 mb-3">Private dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight">{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="mt-2 text-sm leading-6 text-white/45">Your demos, clients, and settings stay tied to your account.</p>
        </div>

        {error && <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3 text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && <label className="block"><span className="mb-2 block text-xs font-medium text-white/55">Full name</span><input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none transition focus:border-sky-400/50" placeholder="Aditya Raj" /></label>}
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/55">Email</span><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm outline-none transition focus:border-sky-400/50" placeholder="you@example.com" /></label>
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/55">Password</span><div className="relative"><LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" /><input required type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400/50" placeholder="At least 8 characters" /></div></label>
          <button disabled={busy} className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 text-sm font-semibold transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/45">
          {mode === 'login' ? 'New to the Demo Engine?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="font-medium text-sky-300 hover:text-sky-200">
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </div>
    </main>
  );
}
