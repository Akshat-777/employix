"use client";

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { LogOut, User2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';

const Navbar = () => {
  const { user } = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        router.push('/');
        toast.success(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const NavLinks = () => (
    <>
      {user && user.role === 'recruiter' ? (
        <>
          <Link href="/admin/dashboard" className="hover:text-fuchsia-600 transition">Dashboard</Link>
          <Link href="/admin/companies" className="hover:text-fuchsia-600 transition">Companies</Link>
          <Link href="/admin/jobs" className="hover:text-fuchsia-600 transition">Jobs</Link>
        </>
      ) : (
        <>
          <Link href="/" className="hover:text-fuchsia-600 transition">Home</Link>
          <Link href="/resume/upload" className="hover:text-fuchsia-600 transition">Upload Resume</Link>
          <Link href="/jobs" className="hover:text-fuchsia-600 transition">Jobs</Link>
          <Link href="/browse" className="hover:text-fuchsia-600 transition">Browse</Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-gradient-to-r from-[#fdfbff] via-[#fce4ec] to-[#fde2f3] text-gray-800 shadow-md sticky top-0 z-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
       
        <Link href="/" className="text-2xl font-extrabold text-pink-600 tracking-wide">
          Employ<span className="text-indigo-500">ix</span>
        </Link>

        
        <nav className="hidden md:flex items-center space-x-6 font-medium">
          <NavLinks />
        </nav>

 
        <div
          className="md:hidden text-indigo-700 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>

     
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-indigo-500 text-indigo-600 hover:bg-indigo-100">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">Signup</Button>
              </Link>
            </>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-pink-300 hover:shadow-md">
                  <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                  <AvatarFallback className="bg-pink-100 text-pink-600 font-semibold">
                    {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl text-gray-800">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                    <AvatarFallback className="bg-pink-100 text-pink-600 font-semibold">
                      {user?.fullname?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg">{user?.fullname}</h4>
                    <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {user.role === 'student' && (
                    <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 cursor-pointer">
                      <User2 size={18} />
                      <Link href="/profile">
                        <Button variant="link" className="p-0 h-auto text-indigo-600">View Profile</Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-red-500 hover:text-red-700 cursor-pointer">
                    <LogOut size={18} />
                    <Button onClick={logoutHandler} variant="link" className="p-0 h-auto text-red-500">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

     
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 text-indigo-800 bg-white border-t border-gray-200 space-y-3 animate-slideDown">
          <NavLinks />
          {!user ? (
            <>
              <Link href="/login">
                <Button className="w-full border border-indigo-500 text-indigo-600 hover:bg-indigo-100">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">Signup</Button>
              </Link>
            </>
          ) : (
            <Button onClick={logoutHandler} className="w-full bg-red-500 hover:bg-red-600 text-white">
              Logout
            </Button>
          )}
        </div>
      )}

    
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
