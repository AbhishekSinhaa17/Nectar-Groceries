import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Delete } from "lucide-react";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — Nectar" },
      { name: "description", content: "Sign in with your mobile number." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F3F2] lg:py-12 lg:px-4 flex flex-col justify-center">
      <div className="animate-page-in min-h-screen bg-white pb-12 lg:max-w-md lg:mx-auto lg:w-full lg:h-[800px] lg:min-h-0 lg:rounded-[30px] lg:overflow-hidden lg:shadow-2xl lg:relative">
        <div className="relative h-[380px] w-full">
          <img
            src="/images/signin_top.png"
            alt="Groceries"
            className="h-full w-full object-cover [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
          />
        </div>

        <div className="px-6 -mt-10">
          <h1 className="text-[28px] font-bold leading-tight text-[#181725] max-w-[280px]">
            Get your groceries
            <br />
            with nectar
          </h1>

          <div
            onClick={() => navigate({ to: "/phone" })}
            className="mt-8 flex cursor-pointer items-center gap-4 border-b border-[#E2E2E2] pb-3 pt-2"
          >
            <img
              src="https://flagcdn.com/w40/in.png"
              alt="IN Flag"
              className="h-[22px] w-[32px] rounded object-cover"
            />
            <span className="text-lg font-medium text-[#181725]">+91</span>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[13px] font-medium text-[#7C7C7C]">Or connect with social media</p>
          </div>

          <div className="mt-8 space-y-4">
            <button className="flex h-[64px] w-full items-center justify-center gap-4 rounded-[20px] bg-[#5383EC] font-semibold text-white transition active:scale-95">
              <span className="grid h-[24px] w-[24px] place-items-center rounded-full bg-white text-xs font-bold text-[#5383EC]">
                G
              </span>
              Continue with Google
            </button>

            <button className="flex h-[64px] w-full items-center justify-center gap-4 rounded-[20px] bg-[#4A66AC] font-semibold text-white transition active:scale-95">
              <span className="grid h-[24px] w-[24px] place-items-center rounded-full text-lg font-bold text-white">
                f
              </span>
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Keypad({ onDigit, onBack }: { onDigit: (d: string) => void; onBack: () => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "back"];
  return (
    <div className="mt-8 grid grid-cols-3 gap-1 border-t border-[#E2E2E2] bg-[#F8F8F8] px-2 pb-6 pt-2">
      {keys.map((k) => (
        <button
          key={k}
          onClick={() => (k === "back" ? onBack() : onDigit(k))}
          className="h-14 rounded-lg bg-white text-xl font-semibold text-[#181725] shadow-sm transition active:scale-95"
        >
          {k === "back" ? <Delete className="mx-auto h-5 w-5" /> : k}
        </button>
      ))}
    </div>
  );
}
