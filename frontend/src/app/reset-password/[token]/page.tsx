"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { Loader2, Lock, CheckCircle } from 'lucide-react';

const ResetPasswordPage = () => {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error('Please enter a new password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const isStrong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password);
    if (!isStrong) {
      toast.error(
        'Password must be 8+ characters with uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/reset-password/${token}`,
        { password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setSuccess(true);
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
        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-600">
                Reset Password
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1 bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400"
                  disabled={loading}
                />
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Must be 8+ characters with uppercase, lowercase, number, and special character.
              </p>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white rounded-md shadow-md flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin h-5 w-5" />}
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Password Reset!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white"
            >
              Go to Login
            </Button>
          </div>
        )}
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

export default ResetPasswordPage;
