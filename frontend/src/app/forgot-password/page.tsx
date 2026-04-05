"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setSent(true);
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f6ff] font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-slideInFade">
        {!sent ? (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-600">
                Forgot Password?
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                No worries! Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  required
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white rounded-md shadow-md flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin h-5 w-5" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-semibold text-gray-700">{email}</span>.
              Please check your inbox (and spam folder).
            </p>
            <Button
              onClick={() => setSent(false)}
              variant="outline"
              className="border-indigo-500 text-indigo-600 hover:bg-indigo-50"
            >
              Resend Email
            </Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-indigo-600 hover:underline font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
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

export default ForgotPasswordPage;
