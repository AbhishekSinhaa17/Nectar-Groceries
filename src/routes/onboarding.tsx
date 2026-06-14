import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — Nectar" },
      { name: "description", content: "Welcome to Nectar online groceries." },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  return (
    <Link to="/signin" className="animate-page-in relative block min-h-screen bg-black">
      <img
        src="/images/onboarding_bg.png"
        alt="Fresh groceries delivery"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </Link>
  );
}
