import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Nectar" },
      { name: "description", content: "Log in to your account." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    login(email || "guest@example.com", password || "12345");
    navigate({ to: "/home" });
  };

  return (
    <div className="animate-page-in min-h-screen bg-white pb-12 flex flex-col relative">
            <div className="absolute top-0 w-full h-[350px] overflow-hidden pointer-events-none">
        <img src="/images/auth_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      </div>

      <div className="pt-20 pb-16 flex justify-center relative z-10">
        <img src="/images/carrot_icon.png" alt="Nectar Logo" className="h-[56px] w-auto object-contain" />
      </div>

      <div className="px-6 flex-1 relative z-10">
        <h1 className="text-[26px] font-bold text-[#181725]">Login</h1>
        <p className="mt-4 text-[15px] font-medium text-[#7C7C7C]">Enter your emails and password</p>

        <div className="mt-10">
          <label className="text-[15px] font-semibold text-[#7C7C7C] block mb-2">Email</label>
          <div className="border-b border-[#E2E2E2] pb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[18px] font-medium text-[#181725] outline-none bg-transparent"
            />
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

        <div className="mt-4 flex justify-end">
          <button className="text-[14px] font-medium text-[#181725]">Forgot Password?</button>
        </div>

        <button 
          onClick={handleLogin}
          className="w-full h-[64px] mt-8 rounded-[20px] bg-[#53B175] text-[18px] font-semibold text-white transition active:scale-95 shadow-sm"
        >
          Log In
        </button>

        <div className="mt-6 flex justify-center items-center gap-1 pb-4">
          <span className="text-[14px] font-medium text-[#181725]">Don't have an account?</span>
          <Link to="/signup" className="text-[14px] font-semibold text-[#53B175]">Signup</Link>
        </div>
      </div>
    </div>
  );
}
