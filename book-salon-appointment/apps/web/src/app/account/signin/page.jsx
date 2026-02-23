import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../utils/useAuth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithCredentials, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await signInWithCredentials({
        email,
        password,
        callbackUrl: '/',
      });
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password.' : 'Sign in failed.');
        setLoading(false);
        return;
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-serif font-bold text-[#1a1a1a] mb-2">Sign in</h1>
      <p className="text-[#666] mb-6">Sign in to manage your bookings.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#444] mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e8b4bc] focus:border-[#c45c6a]"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#444] mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e8b4bc] focus:border-[#c45c6a]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-[#c45c6a] text-white font-medium hover:bg-[#a84a56] disabled:opacity-60 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="relative my-4">
          <span className="block text-center text-sm text-[#999]">or</span>
        </div>
        <button
          type="button"
          onClick={() => signInWithGoogle({ callbackUrl: '/' })}
          className="w-full py-3 px-4 rounded-xl border border-[#e0e0e0] bg-white text-[#1a1a1a] font-medium hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#666]">
        <Link to="/" className="text-[#c45c6a] no-underline hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
