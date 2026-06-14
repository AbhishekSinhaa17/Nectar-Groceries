import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — Nectar" },
      { name: "description", content: "Create an account." },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    signup({ name: username || "New User", email: email || "guest@example.com" });
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-[#F2F3F2] lg:py-12 lg:px-4 flex flex-col justify-center">
      <div className="animate-page-in min-h-screen bg-white pb-12 flex flex-col relative lg:max-w-md lg:mx-auto lg:w-full lg:h-[800px] lg:min-h-0 lg:rounded-[30px] lg:overflow-hidden lg:shadow-2xl">
            <div className="absolute top-0 w-full h-[350px] overflow-hidden pointer-events-none">
        <img src="/images/auth_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      </div>

      <div className="pt-20 pb-16 flex justify-center relative z-10">
        <img src="/images/carrot_icon.png" alt="Nectar Logo" className="h-[56px] w-auto object-contain" />
      </div>

      <div className="px-6 flex-1 relative z-10">
        <h1 className="text-[26px] font-bold text-[#181725]">Sign Up</h1>
        <p className="mt-4 text-[15px] font-medium text-[#7C7C7C]">Enter your credentials to continue</p>

        <div className="mt-10">
          <label className="text-[15px] font-semibold text-[#7C7C7C] block mb-2">Username</label>
          <div className="border-b border-[#E2E2E2] pb-3">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-[18px] font-medium text-[#181725] outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="mt-8">
          <label className="text-[15px] font-semibold text-[#7C7C7C] block mb-2">Email</label>
          <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-[18px] font-medium text-[#181725] outline-none bg-transparent"
            />
            <Check className="h-5 w-5 text-[#53B175]" />
          </div>
        </div>

        <div className="mt-8">
          <label className="text-[15px] font-semibold text-[#7C7C7C] block mb-2">Password</label>
          <div className="flex items-center justify-between border-b border-[#E2E2E2] pb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 text-[18px] tracking-widest font-medium text-[#181725] outline-none bg-transparent"
            />
            <EyeOff className="h-5 w-5 text-[#7C7C7C]" />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[13px] font-medium text-[#7C7C7C] leading-relaxed">
            By continuing you agree to our <span className="text-[#53B175]">Terms of Service</span> and <span className="text-[#53B175]">Privacy Policy.</span>
          </p>
        </div>

        <button 
          onClick={handleSignup}
          className="w-full h-[64px] mt-8 rounded-[20px] bg-[#53B175] text-[18px] font-semibold text-white transition active:scale-95 shadow-sm"
        >
          Sign Up
        </button>

        <div className="mt-6 flex justify-center items-center gap-1 pb-4">
          <span className="text-[14px] font-medium text-[#181725]">Already have an account?</span>
          <Link to="/login" className="text-[14px] font-semibold text-[#53B175]">Login</Link>
        </div>
      </div>
      </div>
    </div>
  );
}
