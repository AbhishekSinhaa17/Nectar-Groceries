import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { LogOut, MapPin, Mail, Phone, Package } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export const Route = createFileRoute("/_app/account")({
  head: () => ({
    meta: [
      { title: "Account — Nectar" },
      { name: "description", content: "Your Nectar account profile." },
    ],
  }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const signOut = () => {
    logout();
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="lg:bg-[#F2F3F2] lg:py-12 lg:min-h-[calc(100vh-80px)] lg:flex lg:flex-col lg:justify-center">
      <div className="animate-page-in min-h-screen bg-white relative pb-24 lg:max-w-md lg:mx-auto lg:w-full lg:h-[800px] lg:min-h-0 lg:rounded-[30px] lg:shadow-2xl lg:overflow-hidden">
        <div className="absolute top-0 w-full h-[350px] overflow-hidden pointer-events-none">
          <img
            src="/images/auth_bg.png"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
        </div>

        <div className="mx-auto max-w-2xl px-4 pt-8 lg:px-8 relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4 border-b border-[#E2E2E2] pb-6">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-[#53B175] text-2xl font-bold text-white shrink-0">
              {(user?.name ?? "G")[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xl font-bold text-[#181725]">{user?.name ?? "Guest"}</p>
              <p className="truncate text-sm text-[#7C7C7C]">{user?.email}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-1">
            <Link to="/orders" className="block">
              <Row
                icon={<Package className="h-5 w-5 text-[#53B175]" />}
                label="Orders"
                value="View Order History"
              />
            </Link>
            <Row
              icon={<Mail className="h-5 w-5 text-[#53B175]" />}
              label="Email"
              value={user?.email ?? "—"}
            />
            <Row
              icon={<Phone className="h-5 w-5 text-[#53B175]" />}
              label="Phone"
              value={user?.phone ?? "—"}
            />
            <Row
              icon={<MapPin className="h-5 w-5 text-[#53B175]" />}
              label="Location"
              value={user?.location ?? "—"}
            />
          </ul>
          <div className="mt-auto pt-6 lg:pb-8">
            <button
              onClick={signOut}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[20px] bg-[#F2F3F2] font-semibold text-[#53B175] transition active:scale-95"
            >
              <LogOut className="h-5 w-5" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center gap-4 border-b border-[#E2E2E2] py-4">
      {icon}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#7C7C7C]">{label}</p>
        <p className="truncate text-sm font-semibold text-[#181725]">{value}</p>
      </div>
    </li>
  );
}
