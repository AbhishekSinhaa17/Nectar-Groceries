import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Delete } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/phone")({
  head: () => ({
    meta: [{ title: "Enter Mobile Number — Nectar" }],
  }),
  component: Phone,
});

function Phone() {
  const navigate = useNavigate();
  const [num, setNum] = useState("");

  const push = (d: string) => setNum((n) => (n.length < 15 ? n + d : n));
  const back = () => setNum((n) => n.slice(0, -1));

  return (
    <div className="min-h-screen bg-[#F2F3F2] lg:py-12 lg:px-4 flex flex-col justify-center">
      <div className="animate-page-in min-h-screen bg-white flex flex-col relative lg:max-w-md lg:mx-auto lg:w-full lg:h-[800px] lg:min-h-0 lg:rounded-[30px] lg:overflow-hidden lg:shadow-2xl">
        <div className="absolute top-0 w-full h-[350px] overflow-hidden pointer-events-none">
          <img
            src="/images/auth_bg.png"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>
        <div className="px-6 pt-12 relative z-10">
          <button onClick={() => window.history.back()} aria-label="Back">
            <ArrowLeft className="h-6 w-6 text-[#181725]" />
          </button>
        </div>

        <div className="px-6 pt-12 flex-1 relative z-10">
          <h1 className="text-[26px] font-bold text-[#181725]">Enter your mobile number</h1>
          <p className="mt-8 text-[15px] font-medium text-[#7C7C7C]">Mobile Number</p>
          <div className="mt-2 flex items-center gap-3 border-b border-[#E2E2E2] py-3">
            <img
              src="https://flagcdn.com/w40/in.png"
              alt="IN Flag"
              className="h-[20px] w-[28px] rounded-sm object-cover"
            />
            <span className="text-[18px] font-medium text-[#181725]">+91</span>
            <span className="flex-1 text-[18px] font-medium text-[#181725]">
              {num}
              <span className="animate-pulse border-r-2 border-black ml-0.5"></span>
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 flex justify-end mt-auto relative z-10">
          <button
            onClick={() => navigate({ to: "/otp" })}
            aria-label="Submit"
            className="grid h-16 w-16 place-items-center rounded-full bg-[#53B175] text-white shadow-md transition active:scale-95"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>

        <IOSKeypad onDigit={push} onBack={back} />
      </div>
    </div>
  );
}

export function IOSKeypad({
  onDigit,
  onBack,
}: {
  onDigit: (d: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="bg-[#D1D4D9] pb-8 pt-2 px-1.5 backdrop-blur-xl bg-opacity-90">
      <div className="grid grid-cols-3 gap-1.5">
        <KeypadButton main="1" sub="" onClick={() => onDigit("1")} />
        <KeypadButton main="2" sub="A B C" onClick={() => onDigit("2")} />
        <KeypadButton main="3" sub="D E F" onClick={() => onDigit("3")} />

        <KeypadButton main="4" sub="G H I" onClick={() => onDigit("4")} />
        <KeypadButton main="5" sub="J K L" onClick={() => onDigit("5")} />
        <KeypadButton main="6" sub="M N O" onClick={() => onDigit("6")} />

        <KeypadButton main="7" sub="P Q R S" onClick={() => onDigit("7")} />
        <KeypadButton main="8" sub="T U V" onClick={() => onDigit("8")} />
        <KeypadButton main="9" sub="W X Y Z" onClick={() => onDigit("9")} />

        <button className="flex items-center justify-center text-xl font-medium text-black transition active:bg-black/10 rounded-lg">
          + * #
        </button>
        <KeypadButton main="0" sub="" onClick={() => onDigit("0")} />
        <button
          onClick={onBack}
          className="flex items-center justify-center text-black transition active:bg-black/10 rounded-lg"
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

function KeypadButton({ main, sub, onClick }: { main: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center h-[54px] bg-[#FCFCFD] rounded-[5px] shadow-[0_1px_0_rgba(0,0,0,0.3)] transition active:bg-[#E5E5E5]"
    >
      <span className="text-[25px] leading-none font-normal text-black mt-1">{main}</span>
      {sub && (
        <span className="text-[10px] leading-none font-bold tracking-widest text-black mt-0.5">
          {sub}
        </span>
      )}
    </button>
  );
}
