'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otpData, setOtpData] = useState({ email: '', otp: '' });
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:5000/api/login'
      : 'http://localhost:5000/api/signup';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (data.token) {
        console.log('Token:', data.token); // Debug
        localStorage.setItem('authToken', data.token);
      }

      if (isLogin) {
        alert('Login successful');
        router.push('/Dashboard');
      } else {
        alert('Signup successful. Check your email for the OTP.');
        setOtpData({ email: formData.email, otp: '' });
        setShowOtpInput(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/signup/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(otpData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      alert('OTP verified successfully');
      router.push('/Dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 via-zinc-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {isLogin ? 'Login' : showOtpInput ? 'Verify OTP' : 'Sign Up'}
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-6">
          {showOtpInput
            ? 'Enter the OTP sent to your email.'
            : isLogin
            ? 'Login with email or Google'
            : 'Create a new account'}
        </p>

        {!showOtpInput ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={otpData.email}
              onChange={(e) => setOtpData({ ...otpData, email: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpData.otp}
              onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
              className="w-full px-4 py-2 bg-zinc-800 text-white border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Verify OTP
            </button>
          </div>
        )}

        {!showOtpInput && (
          <>
            <div className="my-4 text-sm text-zinc-500 text-center">or</div>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
            >
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-6 text-sm text-zinc-400 text-center">
          {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setShowOtpInput(false);
              setOtpData({ email: '', otp: '' });
            }}
            className="text-purple-400 hover:underline"
          >
            {isLogin ? 'Sign up here' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );
}
