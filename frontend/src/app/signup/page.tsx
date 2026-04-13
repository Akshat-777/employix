"use client";

import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';
import { RootState } from '@/redux/store';

const SignupPage = () => {
  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: '',
    file: null as File | null,
  });

  const { loading, user } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, file: e.target.files?.[0] || null });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        router.push('/login');
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#fef6f9] via-[#ece7ff] to-[#d0ebff]">
      <div className="flex items-center justify-center min-h-[85vh] px-4 py-10">
        <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-pink-200 animate-slideInFade">
          
          <div className="w-1/2 bg-gradient-to-br from-fuchsia-100 to-indigo-100 p-8 hidden md:flex flex-col items-center justify-center">
            <Link href="/" className="text-4xl font-extrabold text-pink-600 tracking-wide mb-4">
              Employ<span className="text-indigo-500">ix</span>
            </Link>
            <img
              src="/employix-logo.png"
              alt="Employix Logo"
              className="w-[300px] h-auto rounded-lg shadow-lg mb-6 object-contain bg-white/50 backdrop-blur-sm p-4"
            />
            <p className="text-center text-gray-700 text-lg leading-relaxed px-2 font-medium">
              <span className="text-indigo-700 font-bold text-xl block mb-1">Build Careers. Hire Smarter.</span>
              <span className="text-gray-600 block mb-1">Your next job or hire is just a click away.</span>
              <span className="text-indigo-600 font-medium">
                Employix helps you to land the right job or discover top talent — fast, simple, and effective.
              </span>
            </p>
          </div>

          <form
            onSubmit={submitHandler}
            className="w-full md:w-1/2 p-8"
            encType="multipart/form-data"
          >
            <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
              Create Your Account 
            </h1>

            <div className="mb-4">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                type="text"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="example@domain.com"
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                pattern="[0-9]{10}"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="9876543210"
                required
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="••••••••"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                * Must be at least 8 characters, include uppercase, lowercase, number, and a special character (e.g., @$!%*?&#).
              </p>
            </div>

            <div className="mb-4 flex justify-center gap-6">
              {['student', 'recruiter'].map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`role-${role}`}
                    name="role"
                    value={role}
                    checked={input.role === role}
                    onChange={(e) => setInput({...input, role: e.target.value})}
                    required
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`role-${role}`} className="capitalize text-gray-700 cursor-pointer">
                    {role}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <Label htmlFor="file" className="block mb-2">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="file"
                  className="cursor-pointer px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                >
                  Choose File
                </label>
                <span className="text-sm text-gray-500">
                  {input.file ? input.file.name : 'No file selected'}
                </span>
              </div>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="hidden"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-600 hover:to-indigo-600 text-white rounded-md shadow-md flex justify-center items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? 'Please wait...' : 'Signup'}
            </Button>

            <p className="mt-6 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-fuchsia-600 hover:underline font-medium">
                Login
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

export default SignupPage;
