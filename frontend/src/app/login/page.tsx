"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setLoading, setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
import { Loader2 } from 'lucide-react';
import { RootState } from '@/redux/store';

const LoginPage = () => {
  const [input, setInput] = useState({ email: '', password: '', role: '' });
  const { loading, user } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        if (typeof window !== 'undefined') {
            localStorage.setItem('userId', res.data.user._id);
        }
        toast.success(res.data.message);
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#f9f6ff] font-sans">
      <div className="flex flex-col md:flex-row min-h-[85vh]">
     
        <div className="md:w-1/2 bg-gradient-to-br from-[#fbeaff] via-[#ece9ff] to-[#dbe7ff] flex flex-col justify-center items-center px-10 py-12 text-center">
          <Link href="/" className="text-4xl font-extrabold text-pink-600 tracking-wide mb-4">
            Employ<span className="text-indigo-500">ix</span>
          </Link>
          <div className="text-center max-w-md mb-6 space-y-3">
            <p className="text-2xl font-bold text-indigo-700 leading-snug">
                Build Careers. Hire Smarter.
            </p>
            <p className="text-lg font-medium text-pink-600 leading-snug">
                Your next job or hire is just a click away.
            </p>
            <p className="text-base text-gray-700">
                Employix helps you to land the right job or discover top talent — fast, simple, and effective.
            </p>
          </div>

          <img
            src="/employix-logo.png"
            alt="Employix Logo"
            className="w-[450px] h-auto rounded-xl shadow-lg object-contain bg-white/50 backdrop-blur-sm p-4"
          />
        </div>

        <div className="md:w-1/2 flex justify-center items-center px-6 py-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-slideInFade"
          >
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
              Welcome Back 
            </h2>

            <div className="mb-4">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                required
                className="mt-1 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400"
                disabled={loading}
              />
            </div>

            <div className="mb-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={input.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="mt-1 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400"
                disabled={loading}
              />
            </div>

            <div className="mb-6 flex justify-center gap-6">
              {['student', 'recruiter'].map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`role-${role}`}
                    name="role"
                    value={role}
                    checked={input.role === role}
                    onChange={(e) => setInput({...input, role: e.target.value})}
                    required
                    disabled={loading}
                    className="accent-fuchsia-500 w-4 h-4"
                  />
                  <Label htmlFor={`role-${role}`} className="capitalize text-gray-700">
                    {role}
                  </Label>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white rounded-md shadow-md flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? 'Please wait...' : 'Login'}
            </Button>

            <p className="mt-6 text-sm text-center text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-fuchsia-600 hover:underline font-medium">
                Signup
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideInFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInFade {
          animation: slideInFade 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
