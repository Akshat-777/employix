import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#fef6ff] via-[#fdeef5] to-[#fde2f3] text-gray-700 border-t border-pink-200 py-10 animate-fadeInUp">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-pink-600 tracking-wide">
              Employ<span className="text-indigo-500">ix</span>
            </h2>
            <p className="text-sm mt-1 text-gray-600">
              © {new Date().getFullYear()} Employix Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
