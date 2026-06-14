import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { IOSKeypad } from "./phone";

export const Route = createFileRoute("/otp")({
  head: () => ({
    meta: [
      { title: "Verify OTP — Nectar" },
      { name: "description", content: "Verify your 4-digit code." },
    ],
  }),
  component: Otp,
});

function Otp() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const push = (d: string) => setCode((c) => (c.length < 4 ? c + d : c));
  const back = () => setCode((c) => c.slice(0, -1));

  return (
    <div className="animate-page-in min-h-screen bg-white flex flex-col relative">
            <div className="absolute top-0 w-full h-[350px] overflow-hidden pointer-events-none">
        <img src="/images/auth_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      </div>
      <div className="px-6 pt-12 relative z-10">
        <button onClick={() => window.history.back()} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-[#181725]" />
        </button>
      </div>

      <div className="px-6 pt-12 flex-1 relative z-10">
        <h1 className="text-[26px] font-bold text-[#181725]">Enter your 4-digit code</h1>
        <p className="mt-8 text-[15px] font-medium text-[#7C7C7C]">Code</p>
        <div className="mt-2 border-b border-[#E2E2E2] py-3">
          <span className="text-[22px] tracking-widest font-medium text-[#181725]">
            {code.padEnd(4, "-").split("").join(" ")}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 flex items-center justify-between mt-auto">
        <button className="text-[16px] font-medium text-[#53B175]">Resend Code</button>
        <button
          onClick={() => navigate({ to: "/location" })}
          aria-label="Submit"
          className="grid h-16 w-16 place-items-center rounded-full bg-[#53B175] text-white shadow-md transition active:scale-95"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <IOSKeypad onDigit={push} onBack={back} />
    </div>
  );
}
