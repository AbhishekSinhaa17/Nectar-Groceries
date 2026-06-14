import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nectar — Online Groceries" },
      { name: "description", content: "Nectar: fresh groceries delivered in as fast as one hour." },
      { property: "og:title", content: "Nectar — Online Groceries" },
      { property: "og:description", content: "Fresh groceries delivered in as fast as one hour." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = window.setTimeout(() => navigate({ to: "/onboarding" }), 1800);
    return () => window.clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#53B175] text-white">
      <div className="animate-page-in flex flex-col items-center gap-3">
        <span className="text-6xl">🥕</span>
        <h1 className="text-5xl font-bold tracking-tight">nectar</h1>
        <p className="text-base font-medium opacity-90">online groceries</p>
      </div>
    </div>
  );
}
