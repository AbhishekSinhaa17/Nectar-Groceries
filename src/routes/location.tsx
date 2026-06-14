import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Select Location — Nectar" },
      { name: "description", content: "Select your location." },
    ],
  }),
  component: Location,
});

function Location() {
  const navigate = useNavigate();
  const setTempLocation = useAuthStore((s) => s.setTempLocation);
  const [zone, setZone] = useState("Bangalore");
  const [area, setArea] = useState("");

  const handleSubmit = () => {
    if (zone && area) {
      setTempLocation(`${zone}, ${area}`);
    }
    navigate({ to: "/login" });
  };

  return (
    <div className="animate-page-in min-h-screen bg-white pb-12 relative flex flex-col">
            <div className="absolute top-0 w-full h-[350px] overflow-hidden pointer-events-none">
        <img src="/images/auth_bg.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt="" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
      </div>
      <div className="px-6 pt-12 relative z-10">
        <button onClick={() => window.history.back()} aria-label="Back">
          <ArrowLeft className="h-6 w-6 text-[#181725]" />
        </button>
      </div>

      <div className="px-6 pt-10 flex flex-col items-center relative z-10">
        <img
          src="/images/map_pin.png"
          alt="Map Pin"
          className="w-[200px] h-[150px] object-contain mb-8"
        />
        
        <img
          src="/images/location_text.png"
          alt="Select Your Location"
          className="w-full max-w-[320px] object-contain"
        />
      </div>

      <div className="px-6 pt-14 flex-1 relative z-10">
        <div className="mb-8">
          <label className="text-[15px] font-semibold text-[#7C7C7C] block mb-2">Your Zone</label>
          <Dropdown 
            value={zone} 
            options={["Bangalore"]} 
            placeholder="Types of your zone"
            onChange={setZone} 
          />
        </div>

        <div className="mb-10">
          <label className="text-[15px] font-semibold text-[#7C7C7C] block mb-2">Your Area</label>
          <Dropdown 
            value={area} 
            options={["HSR Layout", "Koramangala", "Indiranagar", "Whitefield", "Jayanagar"]} 
            placeholder="Types of your area"
            onChange={setArea} 
          />
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full h-[64px] rounded-[20px] bg-[#53B175] text-[18px] font-semibold text-white transition active:scale-95 shadow-sm"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function Dropdown({ value, options, placeholder, onChange }: { value: string, options: string[], placeholder: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between border-b border-[#E2E2E2] pb-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-[18px] font-medium ${value ? "text-[#181725]" : "text-[#B1B1B1]"}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-5 w-5 text-[#7C7C7C] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-2 w-full rounded-xl bg-white shadow-lg border border-[#E2E2E2] z-50 max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <div
                key={opt}
                className="px-4 py-3 text-[16px] font-medium text-[#181725] active:bg-[#F2F3F2] cursor-pointer border-b border-[#E2E2E2] last:border-none"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
