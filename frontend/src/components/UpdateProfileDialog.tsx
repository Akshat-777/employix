"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';

interface UpdateProfileDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const UpdateProfileDialog = ({ open, setOpen }: UpdateProfileDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    file: null as File | null,
  });

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max size is 5MB.');
        return;
      }
      setInput((prev) => ({ ...prev, file }));
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('bio', input.bio);
    formData.append('skills', input.skills);
    if (input.file) {
      formData.append('file', input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setTimeout(() => setOpen(false), 500);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[550px] bg-white rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden animate-fadeIn">
        <DialogHeader className="bg-indigo-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <DialogTitle className="text-3xl font-black tracking-tight flex items-center gap-3">
             Update Your Profile
          </DialogTitle>
          <p className="text-indigo-100 font-medium mt-2">Refine your professional presence on Employix.</p>
        </DialogHeader>
        
        <form onSubmit={submitHandler} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                placeholder="Ex: John Doe"
                className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="john@example.com"
                className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="+91 99999 00000"
                className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Skills (Comma separated)</Label>
              <Input
                id="skills"
                name="skills"
                value={input.skills}
                onChange={changeEventHandler}
                placeholder="React, Node, TypeScript"
                className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Short Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="Tell us a bit about what you do..."
              className="h-12 bg-slate-50 border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 border-dashed">
            <Label htmlFor="file" className="text-xs font-bold uppercase tracking-widest text-indigo-400 ml-1 block mb-2">Update Resume (PDF only)</Label>
            <input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
              className="w-full text-slate-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating Profile...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>

        <style jsx>{`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-in-out;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
